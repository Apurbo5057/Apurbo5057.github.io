// Canvas shelter, seams, poles and guy ropes built specifically for Apurbo's Basecamp.
import { THREE } from './three.js?v=19';
import { add, std, rod, canvasTex, rng } from './util.js?v=19';

export function buildTent(world) {
    const texture = canvasTex(512, 512, (c, w, h) => {
        c.fillStyle = '#d8cba9'; c.fillRect(0, 0, w, h);
        const random = rng(57);
        for (let i = 0; i < 4000; i++) {
            c.fillStyle = `rgba(96,77,47,${random() * .06})`;
            c.fillRect(random() * w, random() * h, 2, 1);
        }
        for (const x of [8, 256, 504]) {
            c.strokeStyle = '#bbae8d'; c.lineWidth = 3;
            c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke();
            c.setLineDash([3, 5]); c.strokeStyle = '#eee3c8'; c.lineWidth = 1;
            c.beginPath(); c.moveTo(x + 3, 0); c.lineTo(x + 3, h); c.stroke();
            c.setLineDash([]);
        }
    });
    const cloth = std(0xffffff, { map:texture, side:THREE.DoubleSide, roughness:1 });
    const pole = std(0x745337);
    const rope = std(0xbda77c);
    function panel(vertices) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices.flat(), 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,0,1,1,0,1], 2));
        geo.computeVertexNormals();
        return add(world, geo, cloth, [0,0,0], {cast:false});
    }
    // A pitched roof extends beyond the desk and the visitor's camera.
    for (const side of [-1,1]) {
        panel([[0,4.7,-3.5],[side*3.3,2.85,-3.5],[side*3.3,2.85,7.2],
               [0,4.7,-3.5],[side*3.3,2.85,7.2],[0,4.7,7.2]]);
        for (const z of [-3.45, 6.9]) {
            rod(world, new THREE.Vector3(side*3.2,0,z), new THREE.Vector3(side*3.2,2.85,z), .047,pole);
            rod(world, new THREE.Vector3(side*3.2,2.85,z), new THREE.Vector3(0,4.65,z), .04,pole);
            rod(world, new THREE.Vector3(side*3.25,2.85,z), new THREE.Vector3(side*4.25,-.34,z+.7), .012,rope);
            add(world,new THREE.CylinderGeometry(.025,.025,.3,8),pole,[side*4.25,-.25,z+.7]);
        }
    }
    rod(world,new THREE.Vector3(0,4.65,-3.5),new THREE.Vector3(0,4.65,7.2),.05,pole);
    // Sheltered left wall and back; a wide open flap looks onto the campsite.
    panel([[-3.25,0,-3.4],[-3.25,2.85,-3.4],[-3.25,2.85,7],
           [-3.25,0,-3.4],[-3.25,2.85,7],[-3.25,0,7]]);
    panel([[-3.25,0,-3.32],[.65,0,-3.32],[.65,2.85,-3.32],
           [-3.25,0,-3.32],[.65,2.85,-3.32],[-3.25,2.85,-3.32]]);
    panel([[-3.3,2.85,-3.4],[3.3,2.85,-3.4],[0,4.7,-3.4],
           [-3.3,2.85,-3.4],[0,4.7,-3.4],[-3.3,2.85,-3.4]]);
    panel([[3.25,2.5,-3.4],[3.25,2.85,-3.4],[3.25,2.85,7],
           [3.25,2.5,-3.4],[3.25,2.85,7],[3.25,2.5,7]]);
    for (const x of [.65,3.2]) {
        const roll=add(world,new THREE.CylinderGeometry(.09,.09,2.75,14),cloth,[x,1.4,-3.32]);
        for (const y of [.7,2.1]) add(world,new THREE.TorusGeometry(.092,.012,6,16),rope,[x,y,-3.32]).rotation.x=Math.PI/2;
    }
    // Raised deck edge and steps make the elevation above the forest floor explicit.
    add(world,new THREE.BoxGeometry(6,.32,10),std(0x68533e),[0,-.18,2]);
    for (const [z,y,w] of [[7.3,-.09,2.1],[7.6,-.24,2.4]])
        add(world,new THREE.BoxGeometry(w,.14,.35),pole,[0,y,z]);
}
