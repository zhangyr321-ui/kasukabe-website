// Exterior rebuilt against the accepted interior coordinates; no second house shell is superimposed.
export const FACADE_OPENINGS=[
 {id:'washitsu-garden-window',floor:1,axis:'x',line:34,start:3,end:19,kind:'window'},
 {id:'upper-west-window',floor:2,axis:'y',line:23,start:8,end:22,kind:'window'},
 {id:'entry-sidelight',floor:1,axis:'x',line:80,start:91,end:97,kind:'window'},
 {id:'upper-front-narrow',floor:2,axis:'x',line:62,start:74,end:80,kind:'window'},
 {id:'upper-side-window-a',floor:2,axis:'y',line:100,start:18,end:26,kind:'window'},
 {id:'upper-side-window-b',floor:2,axis:'y',line:100,start:43,end:53,kind:'window'}
];
export function buildExterior({T,scene,floorGroups,base,cube,mat,plan,manifest,F,H}){
const roof=new T.Group(),garden=new T.Group(),front=new T.Group(),upper=new T.Group();scene.add(roof);base.add(garden);floorGroups[0].add(front);floorGroups[1].add(upper);roof.name='roof-assembly';garden.name='garden-and-carport';front.name='front-entry';upper.name='upper-facade';
const C={roof:'#b65043',roofline:'#84392e',wall:'#f2eddb',trim:'#dedbc8',wood:'#a57b4c',metal:'#687f77',glass:'#9dc3c5',yellow:'#cbb77b',brick:'#b77358',leaf:'#668b50'};
function b(w,h,d,c,x,y,z,p){return cube(w,h,d,c,x,y,z,p);}
function rod(a,c,r,color,p){const va=new T.Vector3(...a),vb=new T.Vector3(...c),v=vb.clone().sub(va),m=new T.Mesh(new T.CylinderGeometry(r,r,v.length(),8),mat(color));m.position.copy(va.add(vb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());m.castShadow=true;p.add(m);return m;}
function ball(r,c,x,y,z,p,s=[1,1,1]){const m=new T.Mesh(new T.IcosahedronGeometry(r,2),mat(c));m.position.set(x,y,z);m.scale.set(...s);m.castShadow=true;p.add(m);return m;}
function inside(x,z,r){return x>r[0]&&x<r[2]&&z>r[1]&&z<r[3];}
const roofAudit=[];
function hip(id,rect,y,rise,holes=[]){const [x0,z0,x1,z1]=rect,w=x1-x0,d=z1-z0,g=new T.Group();g.name=id;roof.add(g);const elevation=(x,z)=>y+rise*Math.max(0,Math.min(1,Math.min(x-x0,x1-x,z-z0,z1-z)/(Math.min(w,d)/2)));
 const xs=[x0,x1],zs=[z0,z1];for(let i=1;i<25;i++){xs.push(x0+w*i/25);zs.push(z0+d*i/25);}for(const h of holes){xs.push(...[h[0],h[2]].filter(x=>x>x0&&x<x1));zs.push(...[h[1],h[3]].filter(z=>z>z0&&z<z1));}xs.sort((a,b)=>a-b);zs.sort((a,b)=>a-b);const positions=[];
 for(let i=0;i<xs.length-1;i++)for(let j=0;j<zs.length-1;j++){const a=xs[i],b=xs[i+1],c=zs[j],d=zs[j+1];if(b-a<1e-6||d-c<1e-6||holes.some(h=>inside((a+b)/2,(c+d)/2,h)))continue;const p=[[a,elevation(a,c),c],[b,elevation(b,c),c],[b,elevation(b,d),d],[a,elevation(a,d),d]];positions.push(...p[0],...p[2],...p[1],...p[0],...p[3],...p[2]);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.computeVertexNormals();const m=new T.Mesh(geo,mat(C.roof));g.add(m);m.castShadow=true;m.receiveShadow=true;const under=[];for(let i=0;i<positions.length;i+=9){for(const j of [0,6,3])under.push(positions[i+j],positions[i+j+1]-.075,positions[i+j+2]);}const ug=new T.BufferGeometry();ug.setAttribute('position',new T.Float32BufferAttribute(under,3));ug.computeVertexNormals();const um=new T.Mesh(ug,mat('#ded5b9'));um.name=id+'-soffit';g.add(um);
 const stripePositions=[];function stripe(a,b){const va=new T.Vector3(...a),vb=new T.Vector3(...b);for(let i=0;i<36;i++){const p=va.clone().lerp(vb,i/36),q=va.clone().lerp(vb,(i+1)/36),cx=(p.x+q.x)/2,cz=(p.z+q.z)/2;if(holes.some(h=>inside(cx,cz,h)))continue;stripePositions.push(p.x,elevation(p.x,p.z)+.018,p.z,q.x,elevation(q.x,q.z)+.018,q.z);}}
 for(let k=1;k<13;k++){const inset=Math.min(w,d)*.5*k/14;const a=x0+inset,b=x1-inset,c=z0+inset,farZ=z1-inset;stripe([a,0,c],[b,0,c]);stripe([a,0,farZ],[b,0,farZ]);stripe([a,0,c],[a,0,farZ]);stripe([b,0,c],[b,0,farZ]);}
 const stripeGeo=new T.BufferGeometry();stripeGeo.setAttribute('position',new T.Float32BufferAttribute(stripePositions,3));g.add(new T.LineSegments(stripeGeo,new T.LineBasicMaterial({color:C.roofline})));
 for(const z of [z0,z1])b(w,.11,.08,C.roof,(x0+x1)/2,y-.04,z,g);for(const x of [x0,x1])b(.08,.11,d,C.roof,x,y-.04,(z0+z1)/2,g);
 roofAudit.push({id,rect,eave:y,rise,holes});manifest.push({id,parentId:'roof-assembly',generator:'hip-roof-clipped-grid',rect,eave:y,rise,holes});return g;}
// The upper building occupies x=2.3..10,z=0..6.2. Lower roofs are cut clear of that volume.
hip('upper-hip-roof',[1.87,-.43,10.43,6.63],F+H+.055,1.36);
hip('lower-main-roof',[2.17,-.35,10.42,8.4],2.62,.38,[[2.17,-.18,10.18,6.38],[2.6,6.2,7.0,7.2]]);
hip('lower-west-wing-roof',[-.38,-.35,2.17,3.8],2.62,.55);
// Lower roof no longer covers the confirmed upper balcony slab (top=2.9).
const facadeAudit=[],facadeGroups=[];const pipes=new T.Group();upper.add(pipes);
function window(id,x,y,z,w,h,p,side=false){const g=new T.Group();g.name=id;facadeGroups.push(g);g.position.set(x,y,z);if(side)g.rotation.y=Math.PI/2;p.add(g);const glass=new T.MeshStandardMaterial({color:C.glass,transparent:true,opacity:.43,roughness:.2,depthWrite:false});const pane=new T.Mesh(new T.BoxGeometry(w,h,.025),glass);g.add(pane);for(const a of [-w/2,w/2])b(.055,h+.08,.10,C.metal,a,0,0,g);for(const a of [-h/2,h/2])b(w,.055,.10,C.metal,0,a,0,g);b(.035,h,.07,C.metal,0,0,.025,g);b(w+.14,.07,.20,C.trim,0,-h/2-.04,0,g);facadeAudit.push({id,floor:p===upper?2:1,position:[x,y,z],width:w,height:h});return g;}
// Interior and exterior share the existing living opening; no duplicate front glass.
window('washitsu-garden-window',1.1,1.48,3.405,1.6,1.2,front);
window('upper-west-window',2.295,1.48,1.5,1.4,1.2,upper,true);
window('upper-balcony-door',4.75,1.075,6.205,2.5,2.15,upper);
window('upper-front-narrow',7.7,1.48,6.205,.6,1.2,upper);
window('upper-side-window-a',10.005,1.48,2.2,.8,1.2,upper,true);
window('upper-side-window-b',10.005,1.48,4.8,1.0,1.2,upper,true);
window('entry-sidelight',9.4,1.48,8.005,.6,1.2,front);
// Entry leaf and frame meet the same 7.8..8.8 wall opening as the interior plan.
const door=new T.Group();door.name='entry-door';front.add(door);door.position.set(7.8,0,8.015);b(.96,2.1,.09,'#a6744c',.50,1.05,0,door);b(.72,1.54,.025,'#bb8b5b',.50,1.16,.06,door);b(.045,.24,.06,'#d4bd81',.84,1.0,.09,door);
for(const x of [7.76,8.84])b(.08,2.2,.15,'#775738',x,1.1,8.02,front);b(1.16,.08,.15,'#775738',8.3,2.16,8.02,front);
b(1.4,.09,.36,C.trim,8.3,-.04,8.16,front);b(1.6,.07,.30,'#cbbfa5',8.3,-.08,8.46,front);
const bulb=b(.12,.25,.12,'#fae7b7',7.45,1.65,8.12,front);bulb.material=new T.MeshStandardMaterial({color:'#fae7b7',emissive:'#ffc77a',emissiveIntensity:.25});
// Inter-storey perimeter beam fills the 2.6..2.9 transition without a duplicate solid house.
for(const z of [0,6.2])b(7.7,.30,.20,C.wall,6.15,-.15,z,upper);for(const x of [2.3,10])b(.20,.30,6.2,C.wall,x,-.15,3.1,upper);
// Balcony footprint matches plan rect [27,62,42,9], attached to the same upper floor group.
const balcony=new T.Group();upper.add(balcony);balcony.name='front-balcony';
for(const x of [2.78,6.82])b(.16,1.0,.95,C.wall,x,.5,6.65,balcony);
for(const x of [3.05,6.55])b(.65,1,.14,C.wall,x,.5,7.03,balcony);
b(4.2,.2,.95,C.trim,4.8,-.10,6.65,balcony);b(3.0,.20,.10,C.wall,4.8,.10,7.03,balcony);
rod([3.35,1.0,7.03],[6.25,1.0,7.03],.035,C.metal,balcony);for(let x=3.42;x<6.24;x+=.20)rod([x,.23,7.03],[x,1,7.03],.019,C.metal,balcony);
// Roll-up shutter next to main upper window, with physical slats.
b(.53,1.95,.075,'#c7cabb',3.12,1.13,6.25,upper);for(let y=.22;y<2.07;y+=.10)b(.48,.014,.03,'#859789',3.12,y,6.30,upper);
for(const [x,z] of [[2.18,6.35],[10.13,6.35]]){rod([x,2.59,z],[x,-.18,z],.035,'#b9826c',pipes);}
// Foundation follows room union; no filled solid box behind the furniture.
for(const r of plan.rooms.filter(r=>r.floor===1&&!r.outdoor)){const [x,z,w,d]=r.rect;b(w*.1,.18,d*.1,'#c8c7b5',(x+w/2)*.1,-.19,(z+d/2)*.1,garden);}
// Garden and street-facing boundary.
function hedge(x,z,w,d,h=.65){b(w,h,d,'#517d49',x,h/2+.16,z,garden);for(let t=-w/2+.15;t<w/2;t+=.22)ball(.15,'#6b9256',x+t,h+.12,z,garden,[1,.65,1]);}
function fence(x,z,w,h=1.0,side=false){b(side?.16:w,h,side?w:.16,C.yellow,x,h/2-.08,z,garden);b(side?.23:w+.04,.07,side?w+.04:.23,'#e1d19f',x,h-.04,z,garden);for(let y=.18;y<h;y+=.24)b(side?.17:w,.012,side?w:.17,'#a89f72',x,y,z,garden);}
b(8.7,.22,.18,C.yellow,2.9,.03,9.45,garden);for(const [x,w] of [[-1.10,.7],[1.325,.65],[4.025,.65]])fence(x,9.45,w,1.04);for(const [x,w] of [[.125,1.75],[2.675,2.05],[5.8,2.9]])hedge(x,9.45,w,.31,.64);fence(-1.45,4.1,10.7,.8,true);fence(5.75,-1.2,14.4,.8);fence(13.15,4.1,10.7,.8,true);
for(const x of [7.45,9.7]){b(.4,1.3,.4,C.brick,x,.57,9.45,garden);b(.48,.07,.47,'#d49873',x,1.25,9.45,garden);for(let y=.1;y<1.25;y+=.18)b(.41,.013,.41,'#e0b397',x,y,9.45,garden);}
b(.31,.14,.022,'#ede1b7',7.45,.92,9.665,garden);b(.14,.23,.07,'#ad5e49',7.45,1.40,9.45,garden);
// Open pedestrian gate leaves leave an uninterrupted route to the entry.
for(const x of [7.82,9.33]){const g=new T.Group();g.position.set(x,0,9.45);g.rotation.y=x<8?-.95:.95;garden.add(g);b(.5,.78,.07,'#b89b62',0,.39,0,g);for(let y=.08;y<.77;y+=.10)b(.44,.045,.025,'#dec58b',0,y,.05,g);}
b(1.35,.035,1.75,'#cecbb6',8.5,-.06,8.8,garden);b(2.8,.025,1.4,'#c4c8b7',11.35,-.05,8.75,garden);
function tree(x,z,r=.6){rod([x,-.12,z],[x,1.5*r,z],.08,'#886a47',garden);ball(r,'#648d4e',x,1.9*r,z,garden,[1,1.15,.9]);ball(r*.65,'#7d9c59',x-r*.5,1.65*r,z+.1,garden);}
tree(-.65,2.1,.62);tree(1.65,8.5,.48);tree(5.8,8.45,.53);hedge(3.2,8.65,1,.45,.45);
// Shiro's house is explicitly added by the detail pass, away from roof and plants.
// Carport: light curved canopy, with open sides and clearance above a small car.
const cp=new T.Group();cp.name='carport';garden.add(cp);for(const x of [10.10,12.75])for(const z of [3.5,8.1]){rod([x,-.1,z],[x,2.40,z],.035,C.metal,cp);rod([x,1.92,z],[x+(x<11?.35:-.35),2.42,z],.025,C.metal,cp);}
const canopyGeo=new T.BufferGeometry(),pos=[];function cy(x){return 2.42+.23*Math.sin((x-10)/2.9*Math.PI);}
for(let i=0;i<20;i++){const a=10+i*2.9/20,b=10+(i+1)*2.9/20;pos.push(a,cy(a),3.35,b,cy(b),8.3,b,cy(b),3.35,a,cy(a),3.35,a,cy(a),8.3,b,cy(b),8.3);}
canopyGeo.setAttribute('position',new T.Float32BufferAttribute(pos,3));canopyGeo.computeVertexNormals();const canopy=new T.Mesh(canopyGeo,new T.MeshStandardMaterial({color:'#a3c1bb',transparent:true,opacity:.56,side:T.DoubleSide,roughness:.5}));cp.add(canopy);
for(const z of [3.35,4.2,5.05,5.9,6.75,7.6,8.3])for(let i=0;i<12;i++){const a=10+i*2.9/12,b=10+(i+1)*2.9/12;rod([a,cy(a)+.02,z],[b,cy(b)+.02,z],.017,C.metal,cp);}
for(const x of [10,12.9])rod([x,cy(x),3.35],[x,cy(x),8.3],.025,C.metal,cp);
const car=new T.Group();car.position.set(11.45,0,6.1);cp.add(car);b(1.45,.45,2.75,'#7fab9d',0,.50,0,car);b(1.21,.65,1.45,'#7fab9d',0,.99,-.1,car);b(1.08,.40,.025,'#648e94',0,1.06,.64,car);b(1.08,.40,.025,'#648e94',0,1.06,-.84,car);for(const x of [-.615,.615])b(.02,.38,1.24,'#648e94',x,1.06,-.1,car);
for(const x of [-.73,.73])for(const z of [-.88,.88]){const m=new T.Mesh(new T.CylinderGeometry(.27,.27,.14,16),mat('#3e4942'));m.rotation.z=Math.PI/2;m.position.set(x,.27,z);car.add(m);}for(const x of [-.48,.48])b(.28,.14,.035,'#f6e8bb',x,.56,1.40,car);
// Scissor driveway gate sits beyond the canopy, not in the main entrance.
for(let i=0;i<8;i++){const x=10.05+i*.35;rod([x,.05,9.45],[x+.35,.9,9.45],.02,'#b79d61',garden);rod([x,.9,9.45],[x+.35,.05,9.45],.02,'#b79d61',garden);}
rod([10.05,.92,9.45],[12.85,.92,9.45],.028,'#b79d61',garden);
// Simple aerial over the same upper roof.
rod([6.0,6.89,3.0],[6.0,7.75,3.0],.018,'#7d8980',roof);rod([5.3,7.73,3.0],[6.7,7.73,3.0],.015,'#7d8980',roof);for(let x=5.4;x<6.7;x+=.22)rod([x,7.73,2.77],[x,7.73,3.23],.012,'#7d8980',roof);
manifest.push({id:'garden-and-carport',generator:'procedural-exterior',coordinateBasis:'accepted plan x*.1,z*.1',sourceFeatureIds:['exterior-1','exterior-2','exterior-3','base-plan']});
return {roof,garden,front,upper,roofAudit,facadeAudit,door,balcony,setMode(m){roof.visible=m==='outside';garden.visible=m!=='second';cp.visible=m==='outside'||m==='stack';},setFull(full){door.visible=full;pipes.visible=full;for(const g of facadeGroups)g.visible=full||g.name==='upper-balcony-door';}};
}
