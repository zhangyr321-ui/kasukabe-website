import {addStreetTraffic} from './traffic.js';
import {createInteractions} from './interactions.js';
import {addFlatShinchan} from './flat-shinchan.js';
import * as T from './three.module.js';
import {decorate} from './decorate.js';
import {buildExterior,FACADE_OPENINGS} from './exterior.js';
import {addDetails} from './details.js';
try {
const plan=await fetch('scene-plan.json').then(r=>r.json()),S=.1,H=2.6,F=2.9;
const scene=new T.Scene();scene.background=new T.Color('#e8e6dc');
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;document.body.prepend(renderer.domElement);
const camera=new T.PerspectiveCamera(38,1,.1,150);scene.add(new T.HemisphereLight(0xffffff,0xb6bda8,1.25));const sun=new T.DirectionalLight(0xffe8c4,2.4);sun.position.set(-7,17,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-12,right:12,top:14,bottom:-14,near:.1,far:60});sun.shadow.normalBias=.025;scene.add(sun);
const floorGroups=[new T.Group(),new T.Group()];scene.add(...floorGroups);floorGroups[1].position.y=F;
const materials=new Map(),walls=[],pick=[],labels=[],manifest=[];
function mat(c){if(!materials.has(c))materials.set(c,new T.MeshStandardMaterial({color:c,roughness:.9}));return materials.get(c);}
function cube(w,h,d,c,x,y,z,parent,id){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);if(id)mesh.userData.id=id;return mesh;}
function label(text,w,x,y,z,parent){const c=document.createElement('canvas');c.width=768;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle='#42584d';ctx.font='500 48px Microsoft YaHei, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,80);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,w*160/768),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);parent.add(m);labels.push(m);}
const base=new T.Group();scene.add(base);cube(15,.25,10.9,'#96ad76',5.85,-.245,4.1,base,'plot');

for(const room of plan.rooms){const [x,z,w,d]=room.rect,g=floorGroups[room.floor-1];manifest.push({...room,parentId:'floor-'+room.floor,generator:'zone',dimensions:[w*S,.14,d*S],position:[(x+w/2)*S,(room.floor-1)*F,(z+d/2)*S]});if(room.id==='stair-void')continue;
const mesh=cube(w*S,.14,d*S,room.color,(x+w/2)*S,-.07,(z+d/2)*S,g,room.id);mesh.userData.room=room;pick.push(mesh);
if(false){const size=Math.min(w*S*.85,2.8);label(room.name,size,(x+w/2)*S,.012,(z+d/2)*S,g);}
}
// Split every shared wall at all room corners and portal endpoints, then build one wall per unique segment.
for(const floor of [1,2]){
 const rooms=plan.rooms.filter(r=>r.floor===floor&&!r.outdoor&&r.id!=='balcony'),edges=[];
 for(const room of rooms){const [x,z,w,d]=room.rect;for(const [axis,k,a,b] of [['x',z,x,x+w],['x',z+d,x,x+w],['y',x,z,z+d],['y',x+w,z,z+d]])edges.push({axis,k,a,b,owner:room.id});}
 const ps=plan.portals.filter(p=>rooms.some(r=>r.id===p.a));ps.push(...FACADE_OPENINGS.filter(p=>p.floor===floor));
 if(floor===1)ps.push({axis:'x',line:80,start:78,end:88,kind:'hinged',id:'main-door'},{axis:'x',line:72,start:30,end:64,kind:'sliding',id:'living-garden'});
 if(floor===1)ps.push({axis:'x',line:0,start:43,end:65,kind:'window',id:'kitchen-window'},{axis:'y',line:0,start:8,end:28,kind:'window',id:'tatami-window'},{axis:'x',line:4,start:87,end:98,kind:'window',id:'bath-window'});if(floor===2)ps.push({axis:'x',line:0,start:30,end:65,kind:'window',id:'upper-window'});
 // Stair top must connect to landing without a wall or a slab over the opening.
 if(floor===2)ps.push({axis:'x',line:34,start:84,end:98,kind:'open',id:'stair-top'});
 const lines=new Map();for(const e of edges){const key=e.axis+':'+e.k;if(!lines.has(key))lines.set(key,[]);lines.get(key).push(e);}
 for(const es of lines.values()){
  const {axis,k}=es[0];const portals=ps.filter(p=>p.axis===axis&&p.line===k);const cuts=[...new Set([...es.flatMap(e=>[e.a,e.b]),...portals.flatMap(p=>[p.start,p.end])])].sort((a,b)=>a-b);
  for(let j=0;j<cuts.length-1;j++){const a=cuts[j],b=cuts[j+1],mid=(a+b)/2,owners=es.filter(e=>mid>e.a&&mid<e.b);if(!owners.length)continue;const open=portals.find(p=>mid>p.start&&mid<p.end),external=new Set(owners.map(e=>e.owner)).size===1,thickness=external?.2:.12;
   let y=0,h=H;if(open){if(open.kind==='open')continue;y=2.15;h=H-y;}
   if(open?.kind==='window'){const length=(b-a)*S;const low=axis==='x'?cube(length,.88,thickness,'#f1ead9',mid*S,.44,k*S,floorGroups[floor-1]):cube(thickness,.88,length,'#f1ead9',k*S,.44,mid*S,floorGroups[floor-1]);walls.push({mesh:low,bottom:0,height:.88,axis,k});y=2.08;h=H-y;}
   const wc=owners.some(e=>e.owner==='living')?'#cfe0b1':owners.some(e=>e.owner==='washitsu')?'#d7dfbf':owners.some(e=>e.owner==='dk')?'#eed5bf':'#eee8d8';const length=(b-a)*S;let m;if(axis==='x')m=cube(length,h,thickness,wc,mid*S,y+h/2,k*S,floorGroups[floor-1]);else m=cube(thickness,h,length,wc,k*S,y+h/2,mid*S,floorGroups[floor-1]);
   const cap=cube(axis==='x'?length:.16,.035,axis==='x'?.16:length,'#b99460',axis==='x'?mid*S:k*S,y+h+.018,axis==='x'?k*S:mid*S,floorGroups[floor-1]);if(external){const rm=plan.rooms.find(r=>r.id===owners[0].owner),arr=Array(6).fill(mat(wc));arr[axis==='x'?(k===rm.rect[1]?5:4):(k===rm.rect[0]?1:0)]=mat('#f2eddb');m.material=arr;}walls.push({mesh:m,bottom:y,height:h,axis,k,cap});manifest.push({id:`wall-${floor}-${axis}-${k}-${a}`,parentId:'floor-'+floor,generator:'wall-segment',sourceFeatureIds:owners.map(e=>e.owner),dimensions:[axis==='x'?length:thickness,h,axis==='x'?thickness:length],position:m.position.toArray(),portalId:open?.id||null});
  }
 }
}
// Refined straight stair: lower run extends one world unit into the approved entry envelope.
for(let i=0;i<16;i++){const h=(i+1)*F/16;cube(1.12,h,3.8/16,'#b38a55',9.01,h/2,7.2-(i+.5)*3.8/16,floorGroups[0],'stair-tread-'+i);}
for(const x of [8.43,9.59]){const a=new T.Vector3(x,.85,7.2),b=new T.Vector3(x,F+.85,3.4),v=b.clone().sub(a);const m=new T.Mesh(new T.CylinderGeometry(.025,.025,v.length(),8),mat('#775632'));m.position.copy(a.clone().add(b).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());floorGroups[0].add(m);for(let i=0;i<9;i++)cube(.04,.75,.04,'#8b6a40',x,i/8*F+.375,7.2-i/8*3.8,floorGroups[0]);}
// Thin rail at the edge of the upper void; no floor surface across it.
cube(.06,.65,2.8,'#9faaa0',8.23,.325,4.8,floorGroups[1]);
const decor=decorate({T,scene,floorGroups,base,cube,mat,plan,manifest});
const exterior=buildExterior({T,scene,floorGroups,base,cube,mat,plan,manifest,F,H});
const details=addDetails({T,scene,base,floorGroups,cube,mat,plan,manifest,exterior,H});
const world=createInteractions({T,scene,floorGroups,base,walls,plan,cube,mat,exterior,decor});
const actor=addFlatShinchan({T,scene,camera,walls,floorGroups,plan,world,onStairs:()=>setMode('stack'),onFloor:f=>{setMode(f===2?'second':'first');target.set(9,(f-1)*F+.7,f===2?3.2:6.8);radius=10;}});
world.attach(actor);
const traffic=addStreetTraffic({T,scene,camera,details,cube,mat});
let mode='first',full=false,theta=-.55,phi=.72,radius=21,target=new T.Vector3(5.5,.3,3.8);
function setMode(m){if(m==='outside'){theta=-.55;phi=.95;}else if(mode==='outside'){theta=-.55;phi=.72;}mode=m;full=m==='outside';floorGroups[0].visible=m!=='second';floorGroups[1].visible=!['first'].includes(m);floorGroups[1].position.y=m==='explode'?6.3:F;base.visible=m!=='second';exterior.setMode(m);details.setMode(m);target.set(m==='outside'?3.7:5.8,m==='second'?F+.3:m==='explode'?3:m==='outside'?2:m==='stack'?1.4:.3,m==='outside'?5.5:4.2);radius=m==='outside'?37:m==='explode'?27:23;document.querySelector('#room-name').textContent=({outside:'室内外 · 完整外观',first:'一层 · 室内剖视',second:'二层 · 室内剖视',stack:'上下层 · 屋顶移除',explode:'上下层 · 分层展开'})[m];document.querySelector('#room-size').textContent='同一坐标 · 层高 29 · 主屋最大宽 100';document.querySelector('#room-note').textContent=m==='outside'?'屋顶、外墙、家具和门窗共用一栋建筑。':'切换楼层检查房间与外墙的对应。';document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===m)));setWalls();}
function setWalls(){for(const w of walls){const h=full?w.height:Math.max(0,Math.min(w.height,(w.axis==='x'&&w.k<=4?H:.88)-w.bottom));w.mesh.visible=h>0;w.mesh.scale.y=h/w.height;w.mesh.position.y=w.bottom+h/2;if(w.cap){w.cap.visible=h>0;w.cap.position.y=w.bottom+h+.018;}}decor.setFull(full);exterior.setFull(full);details.setFull(full);document.querySelector('#walls').setAttribute('aria-pressed',String(full));}
for(const b of document.querySelectorAll('[data-mode]'))b.onclick=()=>setMode(b.dataset.mode);
document.querySelector('#walls').onclick=()=>{full=!full;setWalls();};document.querySelector('#top').onclick=()=>{theta=0;phi=.012;};document.querySelector('#reset').onclick=()=>{theta=-.55;phi=.95;setMode('outside');};
function focusRoom(id){setMode('first');const r=plan.rooms.find(r=>r.id===id);const [x,z,w,d]=r.rect;target.set((x+w/2)*S,.65,(z+d/2)*S);theta=-.30;phi=.96;radius=id==='living'?9:7.6;document.querySelector('#room-name').textContent=r.name;document.querySelector('#room-size').textContent=`比例 ${w} × ${d} · 家具按参考估计`;document.querySelector('#room-note').textContent='近景用于检查构件与摆放，可拖动改变角度。';}for(const b of document.querySelectorAll('[data-focus]'))b.onclick=()=>focusRoom(b.dataset.focus);
document.querySelector('#dog-view').onclick=()=>{setMode('first');target.set(.75,.45,4.85);theta=-.3;phi=.98;radius=5.5;document.querySelector('#room-name').textContent='小白的家';document.querySelector('#room-size').textContent='蓝色双坡屋顶 · 拱门 · 食盆与水盆';document.querySelector('#room-note').textContent='狗窝已移出屋檐与植物遮挡，保留独立对象。';};document.querySelector('#road-view').onclick=()=>{setMode('outside');target.set(3.6,.6,7.0);theta=-.72;phi=.62;radius=39;};
document.querySelector('#go-up').onclick=()=>actor.stairs(2);document.querySelector('#go-down').onclick=()=>actor.stairs(1);document.querySelector('#actor-view').onclick=()=>{setMode(actor.floor===2?'second':'first');target.set(actor.sprite.position.x,.65,actor.sprite.position.z);radius=6;};document.querySelector('#actor-reset').onclick=()=>{actor.reset();focusRoom('living');};
const canvas=renderer.domElement;let press=null;const ray=new T.Raycaster();
canvas.onpointerdown=e=>{if(e.button!==0)return;press={x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,max:0};canvas.setPointerCapture(e.pointerId);};
canvas.onpointermove=e=>{if(!press)return;press.max=Math.max(press.max,Math.hypot(e.clientX-press.x,e.clientY-press.y));theta-=(e.clientX-press.lx)*.006;phi=T.MathUtils.clamp(phi+(e.clientY-press.ly)*.006,.02,1.45);press.lx=e.clientX;press.ly=e.clientY;};
canvas.onpointerup=e=>{if(press&&press.max<5){ray.setFromCamera(new T.Vector2(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2),camera);const hits=ray.intersectObjects(world.pickables.filter(o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;}),false);if(hits[0]){const id=hits[0].object.userData.doorId;world.select(id);world.toggle(id);}else if(floorGroups[actor.floor-1].visible){const point=new T.Vector3();if(ray.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),-(actor.floor===2?floorGroups[1].position.y+.02:.02)),point))actor.moveTo(point);}}press=null;};canvas.onpointercancel=canvas.onlostpointercapture=()=>press=null;
canvas.onwheel=e=>{e.preventDefault();radius=T.MathUtils.clamp(radius*Math.exp(e.deltaY*.001),10,40);};
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.zoom=Math.min(1,camera.aspect/1.25);camera.updateProjectionMatrix();}onresize=resize;resize();phi=.95;setMode('outside');
let lastTrafficTime=performance.now();let lastFrame=performance.now();function frame(){const now=performance.now();world.update(Math.min(.05,(now-lastFrame)/1000),full);lastFrame=now;actor.update(now/1000);camera.position.set(target.x+radius*Math.sin(phi)*Math.sin(theta),target.y+radius*Math.cos(phi),target.z+radius*Math.sin(phi)*Math.cos(theta));camera.lookAt(target);world.updateContext(camera,mode);traffic.update(Math.min(.05,(now-lastTrafficTime)/1000),actor,mode);lastTrafficTime=now;renderer.render(scene,camera);requestAnimationFrame(frame);}requestAnimationFrame(frame);
window.greybox={scene,camera,renderer,plan,manifest,floorGroups,walls,pick,setMode,get state(){return {mode,full,theta,phi,radius}},setWalls,decor,focusRoom,exterior,details,actor,world,traffic};window.house=window.greybox;
}catch(e){const el=document.querySelector('#error');el.style.display='block';el.textContent='场景启动失败：'+e.message;console.error(e);}


