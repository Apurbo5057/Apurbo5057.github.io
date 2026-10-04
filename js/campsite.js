// A grounded evening gathering: stones, logs, three seated campers and a guitar.
import { THREE } from './three.js?v=19';
import { add, std, rbox, rod, canvasTex } from './util.js?v=19';

export const CAMP_TARGET = new THREE.Vector3(3,.55,-6.8);
export function buildCampsite(world) {
    const camp = new THREE.Group(); camp.position.set(3,-.38,-6.8); world.add(camp);
    const stone = std(0x8b8879,{flatShading:true}), wood=std(0x684c32);
    const clearing=add(camp,new THREE.CircleGeometry(2.25,40),std(0x675c43),[0,.01,0],{cast:false});
    clearing.rotation.x=-Math.PI/2;
    for(let i=0;i<12;i++) {
        const a=i*Math.PI/6;
        const rock=add(camp,new THREE.IcosahedronGeometry(.16,0),stone,[Math.sin(a)*.48,.12,Math.cos(a)*.48]);
        rock.scale.set(1,.65,.8);
    }
    for (const a of [0,Math.PI/3,-Math.PI/3]) {
        const log=add(camp,new THREE.CylinderGeometry(.07,.09,.7,9),wood,[0,.14,0]);
        log.rotation.set(Math.PI/2,0,a);
    }
    const fire = new THREE.Group(); camp.add(fire);
    const flameMaterials=[0xffac48,0xffd078,0xffe5a2].map(color=>new THREE.MeshBasicMaterial({color,transparent:true,opacity:.85,depthWrite:false}));
    const flames=[];
    for(let i=0;i<7;i++) {
        const h=.35+(i%3)*.14;
        const flame=add(fire,new THREE.ConeGeometry(.09,h,7),flameMaterials[i%3],[(i%3-1)*.095,.2+h/2,(Math.floor(i/3)-1)*.07],{cast:false,receive:false});
        flames.push(flame);
    }
    const glow=new THREE.PointLight(0xffa344,4.5,7,1.8); glow.position.set(0,.6,0); camp.add(glow);
    const emberMat=new THREE.MeshBasicMaterial({color:0xffcb6c});
    const embers=Array.from({length:9},(_,i)=>add(fire,new THREE.SphereGeometry(.013,5,4),emberMat,[0,.5+i*.1,0],{cast:false,receive:false}));
    const noteMap=canvasTex(64,64,(c)=>{c.clearRect(0,0,64,64);c.fillStyle='#f2d692';c.font='48px Georgia';c.fillText('♪',8,50);});
    const singers=[];
    for (const [i,angle] of [-1.2,1.2,Math.PI].entries()) {
        const camper=new THREE.Group(); camper.position.set(Math.sin(angle)*1.35,0,Math.cos(angle)*1.35); camper.rotation.y=angle+Math.PI;camp.add(camper);
        const skin=std([0xbd815c,0xd6a47a,0xa86c4b][i]);
        const clothes=std([0xb98b4f,0x6c8877,0x935f59][i]);
        const dark=std(0x303c37);
        add(camper,new THREE.CylinderGeometry(.22,.24,.32,10),wood,[0,.16,0]);
        add(camper,rbox(.34,.13,.28,.035),dark,[0,.39,.05]);
        for(const side of [-1,1]) {
            rod(camper,new THREE.Vector3(side*.11,.4,.05),new THREE.Vector3(side*.15,.32,.32),.068,dark);
            rod(camper,new THREE.Vector3(side*.15,.32,.32),new THREE.Vector3(side*.16,.08,.4),.045,dark);
            add(camper,rbox(.12,.08,.2,.025),std(0x403b32),[side*.16,.045,.46]);
        }
        const upper=new THREE.Group();upper.position.y=.42;camper.add(upper);
        add(upper,rbox(.34,.36,.2,.06),clothes,[0,.19,.03]);
        add(upper,new THREE.CylinderGeometry(.05,.055,.09,10),skin,[0,.42,.035]);
        const head=add(upper,new THREE.SphereGeometry(.115,14,10),skin,[0,.57,.04]);head.scale.y=1.15;
        add(upper,new THREE.SphereGeometry(.12,14,10,0,Math.PI*2,0,Math.PI*.48),std(0x302a24),[0,.592,.025]);
        for(const side of [-1,1])add(upper,new THREE.SphereGeometry(.008,6,4),dark,[side*.04,.59,.146]);
        const mouth=add(upper,new THREE.SphereGeometry(.018,8,6),std(0x63372a),[0,.53,.147]);mouth.scale.set(.65,.6,.25);
        const strum=new THREE.Group(); strum.position.set(-.18,.32,.02);upper.add(strum);
        rod(strum,new THREE.Vector3(),new THREE.Vector3(-.02,-.2,.21),.045,clothes);
        add(strum,new THREE.SphereGeometry(.035,8,6),skin,[-.02,-.2,.21]);
        rod(upper,new THREE.Vector3(.18,.32,.02),new THREE.Vector3(.24,.09,.21),.044,clothes);
        add(upper,new THREE.SphereGeometry(.034,8,6),skin,[.24,.09,.21]);
        if(i===0) {
            const guitar=new THREE.Group();guitar.position.set(.04,.09,.2);guitar.rotation.z=-.9;upper.add(guitar);
            const body=add(guitar,new THREE.SphereGeometry(.16,14,10),std(0xc38a43));body.scale.set(.82,1,.3);
            add(guitar,new THREE.CylinderGeometry(.05,.05,.005,16),std(0x302a24),[0,.01,.05]).rotation.x=Math.PI/2;
            add(guitar,rbox(.05,.32,.028,.008),wood,[0,.25,0]);
            add(guitar,rbox(.072,.09,.035,.01),wood,[0,.44,0]);
            for(let string=0;string<4;string++)rod(guitar,new THREE.Vector3(-.014+string*.009,-.09,.053),new THREE.Vector3(-.014+string*.009,.43,.02),.001,std(0xddcaa2));
        }
        const note=new THREE.Sprite(new THREE.SpriteMaterial({map:noteMap,transparent:true,depthWrite:false}));
        note.position.set(.2,1.22,0);note.scale.set(.18,.18,1);camper.add(note);
        singers.push({upper,mouth,strum,note,seed:i*2});
    }
    let night=true;
    return {
        setPhase(phase) {night=phase==='night'||phase==='dusk';fire.visible=night;glow.intensity=night?4.5:0;singers.forEach(s=>{s.note.visible=night;});},
        update(time,reducedMotion) {
            if(reducedMotion)return;
            flames.forEach((f,i)=>{f.scale.y=1+Math.sin(time*7+i*2)*.16;f.rotation.z=Math.sin(time*5+i)*.09;});
            if(night)glow.intensity=4.5+Math.sin(time*8)*.25;
            embers.forEach((e,i)=>{const t=(time*.4+i/9)%1;e.position.set(Math.sin(i*4+time)*.12,.3+t*1.1,Math.cos(i*3)*.1);e.scale.setScalar(1-t);});
            singers.forEach(({upper,mouth,strum,note,seed})=>{
                upper.rotation.z=night?Math.sin(time*1.8+seed)*.035:0;
                mouth.scale.y=night?.45+(Math.sin(time*5+seed)+1)*.4:.35;
                strum.rotation.x=night?Math.sin(time*5+seed)*.12:0;
                note.position.y=1.18+((time*.2+seed*.1)%1)*.25;
            });
        },
    };
}
