// Detail pass: distinct semantic targets are kept separate for the next animation stage.
export function addDetails({T,scene,base,floorGroups,cube,mat,plan,manifest,exterior,H}){
const yard=new T.Group(),roads=new T.Group(),architecture=new T.Group();yard.name='yard-details';roads.name='neighborhood-roads';architecture.name='architectural-details';base.add(yard,roads);scene.add(architecture);const targets={};
function b(w,h,d,c,x,y,z,p,id){const m=cube(w,h,d,c,x,y,z,p,id);if(id){m.name=id;targets[id]=m;}return m;}
function group(id,parent){const g=new T.Group();g.name=id;g.userData.semanticId=id;parent.add(g);targets[id]=g;return g;}
function cyl(r,h,c,x,y,z,p,n=24){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,n),mat(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;}
function rod(a,c,r,color,p){const va=new T.Vector3(...a),vb=new T.Vector3(...c),v=vb.clone().sub(va),m=cyl(r,v.length(),color,0,0,0,p,10);m.position.copy(va.add(vb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return m;}
function sphere(r,c,x,y,z,p,scale=[1,1,1]){const m=new T.Mesh(new T.SphereGeometry(r,20,12),mat(c));m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;p.add(m);return m;}
function plaque(t,w,h,x,y,z,p,color='#395963',bg='#eee8d1'){const c=document.createElement('canvas');c.width=512;c.height=160;const q=c.getContext('2d');q.fillStyle=bg;q.fillRect(0,0,512,160);q.fillStyle=color;q.font='bold 92px Microsoft YaHei,sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText(t,256,88);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tex,roughness:.8}));m.position.set(x,y,z);p.add(m);return m;}
// The doghouse now sits clear of the west wing eave (z<=3.8) and the former plant cluster.
const doghouse=group('shiro-doghouse',yard);doghouse.position.set(.75,-.065,4.8);const cream='#eee1bd',blue='#526f9b';
b(.94,.08,.98,'#b9a16b',0,-.015,0,doghouse,'doghouse-floor');b(.94,.80,.08,cream,0,.40,-.45,doghouse);for(const x of [-.43,.43])b(.08,.80,.9,cream,x,.40,0,doghouse);
// Concave front wall polygon leaves a real arch-shaped entrance open at ground level.
const shape=new T.Shape();shape.moveTo(-.47,0);shape.lineTo(-.24,0);shape.lineTo(-.24,.42);shape.absarc(0,.42,.24,Math.PI,0,true);shape.lineTo(.24,0);shape.lineTo(.47,0);shape.lineTo(.47,.80);shape.lineTo(-.47,.80);shape.closePath();const fg=new T.ExtrudeGeometry(shape,{depth:.08,bevelEnabled:false});const face=new T.Mesh(fg,mat(cream));face.position.z=.43;doghouse.add(face);face.castShadow=true;
// Gable infill and two solid roof slopes.
const triangle=new T.Shape();triangle.moveTo(-.50,.80);triangle.lineTo(.50,.80);triangle.lineTo(0,1.10);triangle.closePath();const tg=new T.Mesh(new T.ExtrudeGeometry(triangle,{depth:.90,bevelEnabled:false}),mat(cream));tg.position.z=-.45;doghouse.add(tg);
for(const side of [-1,1]){const roof=b(.68,.065,1.14,blue,side*.28,.95,0,doghouse);roof.rotation.z=-side*.50;for(let i=-3;i<=3;i++){const strip=b(.68,.012,.012,'#8197b5',side*.28,.987,i*.15,doghouse);strip.rotation.z=-side*.50;}}
plaque('シロ',.42,.13,0,.81,.527,doghouse);b(.50,.17,.025,'#546d91',0,.81,.508,doghouse);
// Water and food bowls are independent, named future targets.
function bowl(id,x,z,color){const g=group(id,yard);g.position.set(x,-.12,z);const pts=[[0,0],[.11,0],[.17,.04],[.19,.13],[.175,.15],[.15,.10],[.10,.05],[0,.05]].map(v=>new T.Vector2(...v));g.add(new T.Mesh(new T.LatheGeometry(pts,28),mat(color)));return g;}
const water=bowl('shiro-water-bowl',1.45,5.30,'#6f93ad');cyl(.145,.008,'#89c4d1',0,.095,0,water);
const food=bowl('shiro-food-bowl',1.72,5.42,'#bb7862');for(let i=0;i<10;i++){const a=i*2.4;const k=b(.035,.035,.035,i%2?'#8a643d':'#c39a56',Math.cos(a)*.09,.085+(i%2)*.02,Math.sin(a)*.09,food);k.rotation.y=a;}
// Static simplified Shiro; no character action is implemented in this pass.
const shiro=group('shiro-static',yard);shiro.position.set(.64,-.14,5.65);sphere(.19,'#eee9d7',0,.20,0,shiro,[1.45,.72,.85]);sphere(.15,'#f5efdc',.23,.29,.04,shiro);for(const x of [.12,.34])sphere(.075,'#e5e0cf',x,.25,.06,shiro,[.6,1.3,1]);sphere(.026,'#34433d',.25,.29,.18,shiro);for(const x of [.19,.29])sphere(.012,'#34433d',x,.35,.15,shiro);for(const x of [-.16,.10])for(const z of [-.09,.09])sphere(.05,'#ede7d5',x,.08,z,shiro,[1,1.2,1]);const tail=new T.Mesh(new T.TorusGeometry(.09,.028,8,18),mat('#eee9d7'));tail.position.set(-.25,.30,-.03);shiro.add(tail);
// Small flowerbed and stepping stones keep the entrance visible.
const flowers=group('side-flowerbed',yard);b(.3,.16,1.0,'#bba582',1.92,-.04,4.8,flowers);b(.25,.025,.94,'#88764d',1.92,.025,4.8,flowers);for(let i=0;i<6;i++){const z=4.4+i*.16;rod([1.92,.03,z],[1.92,.27,z],.009,'#73934b',flowers);for(let j=0;j<5;j++)sphere(.028,i%2?'#d79891':'#edca78',1.92+Math.cos(j*1.256)*.045,.27,z+Math.sin(j*1.256)*.045,flowers,[1,.7,1]);}
for(let i=0;i<4;i++){const m=b(.27,.035,.19,'#bdbda5',1.1+(i%2)*.12,-.105,6.0+i*.32,yard);m.rotation.y=i*.23;}
plaque('野原',.28,.14,7.45,.92,9.681,yard);plaque('〒',.12,.12,7.45,1.4,9.51,yard,'#f2e8ce','#a35d46');
// Eave gutters and lower downpipe: roof/ceiling details stay with the building, never with exploded room furniture.
for(const z of [-.43,6.63])rod([1.87,5.49,z],[10.43,5.49,z],.035,'#bc8d72',architecture);
for(const x of [1.87,10.43])rod([x,5.49,-.43],[x,5.49,6.63],.035,'#bc8d72',architecture);
rod([10.30,2.59,8.30],[10.30,-.07,8.30],.035,'#bd987c',architecture);
// Removable flat ceilings complete the enclosure while leaving the stair void intact.
const ceilings=[group('ceiling-floor-1',floorGroups[0]),group('ceiling-floor-2',floorGroups[1])];
function ceiling(rect,p){const [x,z,w,d]=rect;b(w,.045,d,'#dfc89d',x+w/2,H-.027,z+d/2,p);const lines=[];for(let zz=z+.30;zz<z+d;zz+=.30)lines.push(x,H-.052,zz,x+w,H-.052,zz);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(lines,3));p.add(new T.LineSegments(g,new T.LineBasicMaterial({color:'#c3aa7d'})));}
for(const r of plan.rooms.filter(r=>!r.outdoor&&!['stairs','stair-void','balcony'].includes(r.id))){const [x,z,w,d]=r.rect.map(v=>v*.1);if(r.id==='entry'){ceiling([x,z,1, d],ceilings[0]);ceiling([9.8,z,.2,d],ceilings[0]);ceiling([8.2,7.4,1.6,.6],ceilings[0]);}else ceiling([x,z,w,d],ceilings[r.floor-1]);}
// Residential L junction; dimensions are scene design estimates, not a surveyed street.
b(21.9,.15,17.7,'#53665b',3.55,-.47,6.35,roads,'street-plinth');
const horizontalRoad=group('road-front',roads);b(20.7,.12,3.6,'#737f78',4.05,-.32,12.5,horizontalRoad,'front-asphalt');
const verticalRoad=group('road-west',roads);b(3.6,.12,13.0,'#737f78',-4.5,-.32,4.2,verticalRoad,'west-asphalt');
// Sidewalks: front and rear edges, west frontage and far-side strips.
for(const [id,x,z,w,d] of [['front-sidewalk',5.85,10.10,17.1,1.0],['far-front-sidewalk',3.55,14.75,21.9,.8],['west-sidewalk',-2.15,4.15,1.0,13.1],['far-west-sidewalk',-6.75,4.15,.8,13.1]])b(w,.16,d,'#d9d5be',x,-.18,z,roads,id);
// Paving seams use one line batch, not one mesh per paving tile.
const seams=[];for(let x=-2.6;x<=14.4;x+=.55)seams.push(x,-.095,9.6,x,-.095,10.6);for(let z=-2.3;z<10.7;z+=.55)seams.push(-2.65,-.095,z,-1.65,-.095,z);const seamGeo=new T.BufferGeometry();seamGeo.setAttribute('position',new T.Float32BufferAttribute(seams,3));roads.add(new T.LineSegments(seamGeo,new T.LineBasicMaterial({color:'#b8b9a6'})));
// Curb gaps at the driveway prevent a solid kerb blocking a future car route.
for(const [a,bx] of [[-2.65,10.0],[12.9,14.4]])b(bx-a,.15,.13,'#bfc1af',(a+bx)/2,-.145,10.65,roads,'curb-front-'+a);
b(.13,.15,13.0,'#bfc1af',-2.65,-.145,4.2,roads);b(21.9,.15,.13,'#bfc1af',3.55,-.145,14.35,roads);b(.13,.15,13.0,'#bfc1af',-6.35,-.145,4.2,roads);
b(2.9,.07,1.1,'#c9c9b6',11.45,-.13,10.05,roads,'driveway-apron');const rampGeo=new T.BufferGeometry();rampGeo.setAttribute('position',new T.Float32BufferAttribute([10,-.095,10.6,12.9,-.26,10.82,12.9,-.095,10.6,10,-.095,10.6,10,-.26,10.82,12.9,-.26,10.82],3));rampGeo.computeVertexNormals();roads.add(new T.Mesh(rampGeo,mat('#c7c8b6')));
// Quiet white road markings and two pedestrian crossings around the corner.
const marks=group('street-markings',roads);for(let x=1.4;x<14.2;x+=1.65)b(.85,.007,.045,'#e9e8d9',x,-.255,12.5,marks);for(let z=-1.3;z<8;z+=1.65)b(.045,.007,.85,'#e9e8d9',-4.5,-.255,z,marks);
for(let i=0;i<6;i++)b(.23,.008,3.25,'#eeeddf',-.9+i*.42,-.254,12.5,marks);for(let i=0;i<5;i++)b(3.25,.008,.23,'#eeeddf',-4.5,-.254,8.55+i*.42,marks);
for(const z of [10.84,14.16])b(16.9,.007,.035,'#cfd4c4',5.85,-.255,z,marks);for(const x of [-6.16,-2.84])b(.035,.007,10.2,'#cfd4c4',x,-.255,2.9,marks);
// Drainage grilles and manholes.
for(const x of [2.8,6.5,13.6]){b(.52,.018,.22,'#52635a',x,-.245,10.88,roads);for(let i=0;i<6;i++)b(.025,.01,.18,'#a0ab97',x-.20+i*.08,-.232,10.88,roads);}
for(const [x,z]of [[5.1,12.2],[-4.8,4.7]]){cyl(.23,.018,'#596b60',x,-.245,z,roads);for(let i=-2;i<=2;i++)b(.29,.006,.012,'#98a38f',x,-.233,z+i*.065,roads);}
// Street lamps remain named static objects for future lighting control.
for(const [id,x,z]of [['street-lamp-corner',-1.95,10.05],['street-lamp-front',5.7,10.0]]){const g=group(id,roads);rod([x,-.1,z],[x,2.7,z],.035,'#5e7567',g);rod([x,2.7,z],[x+.35,2.7,z],.03,'#5e7567',g);b(.45,.08,.25,'#5a7163',x+.3,2.69,z,g);b(.35,.025,.19,'#e7dec1',x+.3,2.635,z,g);}
// Named anchors describe the next phase without implementing any action yet.
const anchorPlan={doghouse:'shiro-doghouse',water:'shiro-water-bowl',food:'shiro-food-bowl',laundry:['laundry-0','laundry-1','laundry-2'],dining:'dining-table',sleep:'sleep-futon',roomLamps:['living-furnishings-ceiling-light','dk-furnishings-ceiling-light','washitsu-furnishings-ceiling-light']};
for(const [id,g] of Object.entries(targets)){g.userData.semanticId=id;manifest.push({id,parentId:g.parent?.name||'details',generator:g.isGroup?'semantic-group':g.geometry.type,position:g.position.toArray(),state:'static',phase:'detail-and-streets'});}
return {yard,roads,architecture,ceilings,doghouse,shiro,targets,anchorPlan,roadLayout:{front:{x:[-6.3,14.4],z:[10.7,14.3],width:3.6},west:{x:[-6.3,-2.7],z:[-2.3,10.7],width:3.6},driveway:{x:[10,12.9],curbGap:true}},setMode(mode){roads.visible=mode!=='second';architecture.visible=mode==='outside';for(const g of ceilings)g.visible=mode==='outside';},setFull(full){/* ceiling visibility is governed by assembled mode, not wall-height toggle */}};
}
