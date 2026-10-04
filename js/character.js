// A compact, procedural desk worker. Local +z faces the keyboard.
import { THREE } from './three.js';
import { std, rbox, add, rod } from './util.js';

export function buildDeskWorker(chair) {
    const person = new THREE.Group();
    person.name = 'Seated desk worker';
    chair.add(person);
    const skin = std(0xc98e68, { roughness: 0.85 });
    const shirt = std(0x328f91, { roughness: 0.9 });
    const trousers = std(0x29364b, { roughness: 0.9 });
    const hair = std(0x211d24, { roughness: 1 });
    const shoes = std(0xeeeeec, { roughness: 0.8 });
    const sole = std(0x263042);
    const segment = (parent, a, b, radius, material) =>
        rod(parent, new THREE.Vector3(...a), new THREE.Vector3(...b), radius, material);

    // Hips rest on the seat; bent knees and planted feet sit beneath the desk.
    add(person, rbox(0.32, 0.14, 0.26, 0.045), trousers, [0, 0.54, 0.03]);
    for (const side of [-1, 1]) {
        const x = side * 0.105;
        segment(person, [x, 0.54, 0.06], [x, 0.49, 0.34], 0.075, trousers);
        add(person, new THREE.SphereGeometry(0.073, 12, 10), trousers, [x, 0.48, 0.34]);
        segment(person, [x, 0.48, 0.34], [x, 0.12, 0.39], 0.058, trousers);
        add(person, rbox(0.135, 0.09, 0.25, 0.035), shoes, [x, 0.08, 0.46]);
        add(person, rbox(0.14, 0.025, 0.255, 0.012), sole, [x, 0.032, 0.46]);
    }

    const torso = add(person, rbox(0.34, 0.43, 0.22, 0.065), shirt, [0, 0.79, 0.07]);
    torso.rotation.x = 0.13;
    add(person, new THREE.CylinderGeometry(0.054, 0.06, 0.095, 12), skin, [0, 1.035, 0.12]);
    const head = new THREE.Group();
    head.position.set(0, 1.19, 0.14);
    person.add(head);
    const face = add(head, new THREE.SphereGeometry(1, 16, 12), skin);
    face.scale.set(0.115, 0.145, 0.105);
    const cap = add(head, new THREE.SphereGeometry(1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.57), hair, [0, 0.014, -0.013]);
    cap.scale.set(0.121, 0.145, 0.112);
    for (const side of [-1, 1]) {
        add(head, new THREE.SphereGeometry(0.025, 10, 8), skin, [side * 0.113, -0.005, 0]);
        add(head, new THREE.SphereGeometry(0.009, 8, 6), hair, [side * 0.041, 0.008, 0.095]);
    }
    add(head, new THREE.SphereGeometry(0.019, 10, 8), skin, [0, -0.015, 0.103]);

    // Sleeves, elbows, and forearms lead naturally to both hands on the keys.
    const forearms = [];
    const shoulders = [];
    for (const side of [-1, 1]) {
        const shoulder = [side * 0.18, 0.94, 0.08];
        const elbow = [side * 0.21, 0.78, 0.31];
        const arm = new THREE.Group();
        person.add(arm);
        segment(arm, shoulder, [side * 0.197, 0.86, 0.195], 0.064, shirt);
        segment(arm, [side * 0.197, 0.86, 0.195], elbow, 0.045, skin);
        add(arm, new THREE.SphereGeometry(0.045, 12, 8), skin, elbow);
        const forearm = new THREE.Group();
        forearm.position.set(...elbow);
        arm.add(forearm);
        segment(forearm, [0, 0, 0], [-side * 0.085, 0.027, 0.2], 0.037, skin);
        add(forearm, rbox(0.075, 0.035, 0.09, 0.014), skin, [-side * 0.085, 0.028, 0.225]);
        for (let finger = 0; finger < 4; finger++) {
            add(forearm, rbox(0.011, 0.018, 0.035, 0.004), skin,
                [-side * 0.085 - 0.026 + finger * 0.017, 0.018, 0.275]);
        }
        forearms.push(forearm);
        // Move the pivot to the shoulder while preserving the resting pose.
        arm.position.set(...shoulder);
        arm.children.forEach((child) => child.position.sub(arm.position));
        shoulders.push(arm);
    }

    // A little floating heart appears during the greeting.
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, -0.05);
    heartShape.bezierCurveTo(-0.12, 0.02, -0.08, 0.13, 0, 0.075);
    heartShape.bezierCurveTo(0.08, 0.13, 0.12, 0.02, 0, -0.05);
    const heart = add(person, new THREE.ShapeGeometry(heartShape),
        new THREE.MeshBasicMaterial({ color: 0xff8fad, side: THREE.DoubleSide }),
        [0, 1.52, 0.1], { cast: false, receive: false });
    heart.visible = false;
    let greetedAt = -Infinity;
    return {
        group: person,
        greet(time) { greetedAt = time; },
        update(time, reducedMotion) {
            const elapsed = time - greetedAt;
            const greeting = elapsed >= 0 && elapsed < 3;
            const ease = greeting && !reducedMotion
                ? Math.min(1, elapsed / 0.35, (3 - elapsed) / 0.45) : 0;
            const wave = greeting && !reducedMotion ? Math.sin(elapsed * 10) * 0.18 * ease : 0;
            // Tiny alternating keystrokes; reduced-motion visitors see a still pose.
            forearms.forEach((arm, i) => {
                const typing = reducedMotion ? 0 : Math.sin(time * 7 + i * Math.PI) * 0.022;
                arm.rotation.x = i === 1 ? typing * (1 - ease) - ease * 1.3 : typing * (1 - ease);
                arm.rotation.z = i === 1 ? wave : 0;
            });
            shoulders[1].rotation.z = ease * 2.15;
            shoulders[1].rotation.x = -ease * 0.4;
            head.rotation.y = ease * 2.4;
            head.rotation.x = 0.075 + (reducedMotion ? 0 : Math.sin(time * 1.3) * 0.012);
            head.rotation.z = ease * 0.12;
            heart.visible = greeting;
            heart.position.y = 1.52 + (greeting && !reducedMotion ? Math.sin(elapsed * 3) * 0.025 : 0);
            heart.rotation.y = -head.rotation.y;
        },
    };
}
