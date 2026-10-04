// Original procedural mountain scenery: no models, stock photos, or texture downloads.
import { THREE } from './three.js?v=8';
import { add, std, rng } from './util.js?v=8';

export function buildLandscape(world) {
    const backdrop = new THREE.MeshBasicMaterial({ toneMapped: false });
    add(world, new THREE.PlaneGeometry(100, 48), backdrop, [0, 14, -30], { cast: false, receive: false });
    const random = rng(5057);
    const ground = add(world, new THREE.PlaneGeometry(100, 100), std(0x344b32), [0, -.38, 0], { cast:false });
    ground.rotation.x = -Math.PI / 2;
    const stone = [0x597b76, 0x436760, 0x314e49];
    for (let row = 0; row < 3; row++) {
        for (let i = 0; i < 8; i++) {
            const height = 5 + random() * 7;
            const radius = 3.5 + random() * 2.5;
            const x = -24 + i * 7 + random() * 2;
            const z = -24 + row * 5;
            const mountain = add(world, new THREE.ConeGeometry(radius, height, 5, 1),
                std(stone[row], { flatShading: true, roughness: 1 }), [x, height / 2 - 1.5, z], { cast: false });
            mountain.rotation.y = random() * 2;
            if (row < 2) {
                const snowHeight = height * 0.22;
                const snow = add(world, new THREE.ConeGeometry(radius * 0.225, snowHeight, 5),
                    std(0xd5e3d5, { flatShading: true }), [x, height - snowHeight / 2 - 1.49, z], { cast: false });
                snow.rotation.y = mountain.rotation.y;
            }
        }
    }
    const bark = std(0x514132);
    const needles = [std(0x244b3e, { flatShading: true }), std(0x345f49, { flatShading: true })];
    function pine(x, z, height) {
        const tree = new THREE.Group();
        tree.position.set(x, -0.35, z);
        add(tree, new THREE.CylinderGeometry(0.06, 0.1, height, 7), bark, [0, height / 2, 0]);
        for (let tier = 0; tier < 3; tier++) {
            add(tree, new THREE.ConeGeometry(height * (0.28 - tier * 0.045), height * 0.48, 7),
                needles[tier % 2], [0, height * (0.42 + tier * 0.2), 0]);
        }
        world.add(tree);
    }
    for (let i = 0; i < 36; i++) {
        const x = -15 + random() * 30;
        pine(x, -8 - random() * 5, 1.4 + random() * 1.8);
    }
    for (const [x, z, height] of [[-4.4, -2, 3.6], [4.8, -2.5, 4.2], [-4.7, 1, 3], [5.2, 1.4, 3.4]]) pine(x, z, height);
    // Ferns growing beside the timber deck.
    for (let i = 0; i < 18; i++) {
        const side = i % 2 ? 1 : -1;
        const fern = add(world, new THREE.IcosahedronGeometry(0.25 + random() * 0.18, 0),
            needles[i % 2], [side * (3.1 + random() * 0.6), 0.1, -2 + random() * 6]);
        fern.scale.y = 0.5;
    }
    const fireflyMaterial = new THREE.MeshBasicMaterial({ color: 0xe6d78f, transparent: true, opacity: 0.8, toneMapped: false });
    const fireflies = Array.from({ length: 18 }, (_, i) => {
        const origin = new THREE.Vector3(-3.7 + random() * 7.4, 0.7 + random() * 1.9, -4 + random() * 3);
        const fly = add(world, new THREE.SphereGeometry(0.012, 6, 4), fireflyMaterial, origin.toArray(), { cast: false, receive: false });
        return { fly, origin, seed: i * 1.7 };
    });
    let night = true;
    return {
        skyMat: backdrop,
        setPhase(phase) { night = phase === 'night'; fireflies.forEach(({ fly }) => { fly.visible = night; }); },
        update(time, reducedMotion) {
            if (!night || reducedMotion) return;
            for (const { fly, origin, seed } of fireflies) {
                fly.position.set(origin.x + Math.sin(time * 0.25 + seed) * 0.18,
                    origin.y + Math.sin(time * 0.45 + seed) * 0.12, origin.z + Math.cos(time * 0.3 + seed) * 0.1);
            }
        },
    };
}
