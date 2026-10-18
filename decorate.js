export function decorate({T,scene,floorGroups,base,cube,mat,plan,manifest}){
const warm='#bc935d',dark='#705037',trim='#a9824e',cream='#f2e6c8',green='#b3ca79';let seq=0;const fixtures=[];
function group(id,floor,room,sources){const g=new T.Group();g.name=id;floorGroups[floor-1].add(g);g.userData={id,room,sources};manifest.push({id,parentId:'floor-'+floor,generator:'procedural-furniture',sourceFeatureIds:sources,room});return g;}
function b(w,h,d,c,x,y,z,p){return cube(w,h,d,c,x,y,z,p);}
function cyl(r,h,c,x,y,z,p,n=24){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,n),mat(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;}
function ball(r,c,x,y,z,p,scale=[1,1,1]){const m=new T.Mesh(new T.SphereGeometry(r,20,12),mat(c));m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;p.add(m);return m;}
function rod(a,c,r,color,p){const va=new T.Vector3(...a),vb=new T.Vector3(...c),v=vb.clone().sub(va);const m=cyl(r,v.length(),color,0,0,0,p,10);m.position.copy(va.add(vb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return m;}
function texture(kind,c1,c2){const c=document.createElement('canvas');c.width=c.height=512;const q=c.getContext('2d');q.fillStyle=c1;q.fillRect(0,0,512,512);q.strokeStyle=c2;q.lineWidth=1;
if(kind==='wood'){for(let y=0;y<512;y+=5){q.beginPath();for(let x=0;x<=512;x+=8){const yy=y+Math.sin(x*.03+y)*1.8;x?q.lineTo(x,yy):q.moveTo(x,yy);}q.stroke();}for(let y=0;y<512;y+=128){q.lineWidth=2;q.beginPath();q.moveTo(0,y);q.lineTo(512,y);q.stroke();}}
else if(kind==='tatami'){for(let y=0;y<512;y+=3){q.beginPath();q.moveTo(0,y);q.lineTo(512,y);q.stroke();}q.globalAlpha=.16;for(let x=0;x<512;x+=7)q.fillRect(x,0,1,512);}
else{for(let x=0;x<512;x+=64){q.beginPath();q.moveTo(x,0);q.lineTo(x,512);q.moveTo(0,x);q.lineTo(512,x);q.stroke();}}
const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return new T.MeshStandardMaterial({map:t,roughness:.85});}
const wood=texture('wood','#b38b51','#987341'),tatami=texture('tatami','#ccd89a','#b8c788'),tile=texture('tile','#c6dedb','#eff5e7'),pink=texture('wood','#d9a19a','#d19a92');
function surface(w,d,material,x,z,parent,y=.017){const m=new T.Mesh(new T.BoxGeometry(w,.025,d),material);m.position.set(x,y,z);m.receiveShadow=true;parent.add(m);return m;}
function plant(x,z,p,y=0,size=1){cyl(.13*size,.25*size,'#d3b77a',x,y+.125*size,z,p);for(let i=0;i<7;i++){const a=i*2.4;rod([x,y+.22*size,z],[x+Math.cos(a)*.13*size,y+(.5+(i%3)*.05)*size,z+Math.sin(a)*.13*size],.012*size,'#5d7744',p);ball(.14*size,i%2?'#688e47':'#83a552',x+Math.cos(a)*.14*size,y+(.47+(i%3)*.05)*size,z+Math.sin(a)*.14*size,p,[1,.6,1]);}}
function cup(x,y,z,p,color='#f8f3df'){cyl(.055,.10,color,x,y+.05,z,p);cyl(.044,.005,'#7e643f',x,y+.104,z,p);const h=new T.Mesh(new T.TorusGeometry(.035,.009,7,16),mat(color));h.position.set(x+.062,y+.06,z);p.add(h);}
function bowl(x,y,z,p){const pts=[[0,0],[.035,0],[.055,.012],[.1,.055],[.105,.075],[.095,.075],[.085,.055],[.045,.025],[0,.025]].map(v=>new T.Vector2(...v));const m=new T.Mesh(new T.LatheGeometry(pts,24),mat('#f7f1d9'));m.position.set(x,y,z);p.add(m);return m;}
function curtain(w,x,z,p,y=1.45,color='#e0a6ae',axis='front'){const g=new T.Group();g.position.set(x,y,z);p.add(g);if(axis==='side')g.rotation.y=Math.PI/2;for(const side of [-1,1]){for(let i=0;i<7;i++)cyl(.035,1.9,color,side*(w/2-.10)+i*.035-.1,0,.03,g,12);b(.3,.08,.11,'#d3a26b',side*(w/2-.07),-.38,.02,g);}rod([-w/2-.2,1.0,.03],[w/2+.2,1.0,.03],.027,dark,g);}
function window(w,h,x,y,z,p,axis='front',color='#b4d8d9'){const g=new T.Group();g.position.set(x,y,z);p.add(g);if(axis==='side')g.rotation.y=Math.PI/2;const glass=new T.MeshStandardMaterial({color,transparent:true,opacity:.38,roughness:.23,depthWrite:false});const m=new T.Mesh(new T.BoxGeometry(w,h,.025),glass);g.add(m);for(const a of [-w/2,w/2])b(.055,h+.08,.10,'#778d8a',a,0,0,g);for(const a of [-h/2,h/2])b(w,.055,.10,'#778d8a',0,a,0,g);b(.038,h,.07,'#718583',0,0,.02,g);return g;}
function cupboard(w,h,d,x,z,p,color=warm){b(w,h,d,color,x,h/2,z,p);const count=Math.max(2,Math.round(w/.45));for(let i=0;i<count;i++){let xx=x-w/2+(i+.5)*w/count;b(w/count-.025,h-.1,.025,'#c5a06b',xx,h/2,z+d/2+.012,p);b(.1,.025,.025,'#6f6651',xx+.07,h*.6,z+d/2+.035,p);}b(w+.05,.05,d+.03,dark,x,h+.025,z,p);}
function table(w,d,h,x,z,p){const top=b(w,.09,d,warm,x,h,z,p); // material supplied below
 top.material=wood;for(const a of [-1,1])for(const c of [-1,1])b(.095,h-.045,.095,dark,x+a*(w/2-.12),(h-.045)/2,z+c*(d/2-.12),p);return top;}
function chair(x,z,rot,p){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=rot;p.add(g);for(const a of [-.2,.2])for(const c of [-.2,.2])b(.055,.46,.055,dark,a,.23,c,g);b(.5,.07,.48,warm,0,.47,0,g);b(.45,.06,.43,'#c45f69',0,.52,0,g);for(const a of [-.2,.2])b(.055,.55,.055,dark,a,.75,-.20,g);b(.45,.27,.055,'#c45f69',0,.88,-.20,g);}
// Floor treatments: living green carpet, actual tatami seams only in the sleeping room.
const living=group('living-furnishings',1,'living',['current-12','current-18-upper','current-22-style']);surface(4.8,3.6,texture('tatami','#bad476','#b5cf72'),4.7,5.3,living);
const room=group('washitsu-furnishings',1,'washitsu',['base-plan','current-11','current-19-style']);for(let ix=0;ix<2;ix++)for(let iz=0;iz<3;iz++){const x=.15+(ix+.5)*1.55,z=.15+(iz+.5)*1.0;surface(1.52,.97,tatami,x,z,room);for(const a of [-.76,.76])b(.022,.018,.97,'#627848',x+a,.04,z,room);}
const dk=group('dk-furnishings',1,'dk',['current-17-upper','current-27-upper','current-04-supplement']);surface(3.6,3.2,pink,5.3,1.7,dk);
const hall=group('hall-furnishings',1,'entry',['current-16-upper']);for(const r of plan.rooms.filter(r=>['hall','entry','hall-branch'].includes(r.id))){const [x,z,w,d]=r.rect;surface(w*.1-.06,d*.1-.06,wood,(x+w/2)*.1,(z+d/2)*.1,hall);}
// Low table, floor cushions, books and vintage television.
table(1.7,1,.38,4.75,5.25,living);for(const [x,z,c] of [[3.5,5.3,'#a9a5c0'],[5.95,5.3,'#c5b48f'],[4.7,6.25,'#b59eae']])b(.48,.07,.48,c,x,.08,z,living);
cup(4.35,.435,5.15,living);b(.22,.13,.15,'#e3dfb2',5.05,.50,5.15,living);b(.12,.006,.05,'#faf5e3',5.05,.57,5.15,living);for(let i=0;i<3;i++)b(.31,.025,.23,['#bd7662','#618f9c','#f0d77b'][i],4.9,.45+i*.025,5.5,living);
cupboard(.95,.4,.38,2.65,6.3,living,'#686f69');b(.82,.57,.34,'#565e58',2.65,.73,6.3,living);b(.65,.43,.025,'#252f31',2.62,.74,6.48,living);b(.56,.34,.025,'#75989d',2.6,.75,6.5,living);cyl(.035,.01,'#c8c8b2',3,.64,6.49,living).rotation.x=Math.PI/2;
window(3.4,2.15,4.7,1.075,7.20,living);curtain(3.4,4.7,7.13,living,1.13,'#dba4af');
// Low glass-front sideboard along the back partition, with a fish print above.
cupboard(1.7,.65,.32,3.10,3.68,living);for(let i=0;i<3;i++)b(.5,.43,.018,'#a8c7c4',2.56+i*.54,.33,3.86,living);
plant(3.5,3.68,living,.68,.7);for(let i=0;i<5;i++)b(.04,.16+i*.012,.10,['#b55f54','#e2c36b','#6e9aa0'][i%3],2.4+i*.055,.77,3.69,living);
const artGroup=new T.Group();living.add(artGroup);b(.78,.48,.045,'#ab824f',3.1,1.75,3.48,artGroup);b(.65,.36,.03,'#7ca6bb',3.1,1.75,3.51,artGroup);for(const yy of [1.68,1.83])ball(.10,'#eac45d',3.1,yy,3.54,artGroup,[1,.35,.12]);fixtures.push(artGroup);
plant(6.65,6.7,living,0,1.4);
// Bedroom wall closet, alcove, futon and a small toy/book shelf.
cupboard(2.3,2.15,.45,2.05,.33,room,'#b9a66f');for(let i=0;i<2;i++){b(1.08,1.93,.025,'#c7c9a3',1.48+i*1.12,1.08,.57,room);cyl(.035,.018,'#655c48',1.9+i*.35,1,.595,room).rotation.x=Math.PI/2;}
b(.7,.13,.55,'#92683e',.48,.09,.35,room);b(.32,.75,.02,'#ece0b8',.48,1.35,.12,room);b(.16,.04,.02,'#5d6849',.48,1.48,.14,room);plant(.48,.35,room,.15,.65);
b(1.0,.15,1.85,'#83acc3',1.75,.12,1.6,room).name='sleep-futon';b(.94,.13,1.45,'#d9e4df',1.75,.23,1.78,room);b(.64,.14,.36,'#c4d7df',1.75,.24,.88,room);for(let i=0;i<5;i++)b(.9,.008,.008,'#bfced0',1.75,.30,1.2+i*.25,room);
window(2,1.2,.01,1.5,1.8,room,'side');curtain(2,.12,1.8,room,1.3,'#93b9ab','side');
const toy=b(.45,.27,.4,'#ba7054',.6,.16,1.8,room);ball(.1,'#e3c46e',.51,.35,1.8,room);ball(.11,'#85a1b8',.69,.37,1.85,room);
// Kitchen: yellow cabinet fronts, sink below window, double burner, hood and refrigerator.
const counter=b(2.6,.82,.58,'#d6ce91',5.5,.41,.42,dk);for(let i=0;i<5;i++){const x=4.46+i*.52;b(.49,.7,.025,'#e1d497',x,.4,.724,dk);b(.16,.025,.035,'#b77e72',x,.68,.75,dk);}b(2.7,.055,.65,'#dce0d5',5.5,.85,.43,dk);
// Recessed sink: black basin below a four-piece counter rim, rather than a raised block.
b(.66,.08,.43,'#7b9290',4.85,.84,.43,dk);b(.5,.06,.29,'#536f70',4.85,.89,.43,dk);rod([4.85,.87,.18],[4.85,1.13,.18],.024,'#a9bcb3',dk);rod([4.85,1.13,.18],[4.85,1.13,.40],.024,'#a9bcb3',dk);
b(.75,.035,.5,'#a3aaa1',6.18,.90,.43,dk);for(const x of [5.99,6.37]){cyl(.14,.018,'#343e37',x,.93,.43,dk);cyl(.08,.02,'#667268',x,.94,.43,dk);}b(.54,.32,.025,'#7d8a82',6.18,.44,.75,dk);b(.39,.18,.025,'#344744',6.18,.45,.77,dk);
cyl(.15,.18,'#ae5244',6.2,1.04,.43,dk);cyl(.17,.025,'#7e4336',6.2,1.14,.43,dk);ball(.03,'#433c2e',6.2,1.17,.43,dk);
const hood=new T.Mesh(new T.CylinderGeometry(.22,.42,.4,4),mat('#b6bcb0'));hood.rotation.y=Math.PI/4;hood.position.set(6.18,1.85,.38);dk.add(hood);b(.4,.45,.28,'#b6bcb0',6.18,2.23,.22,dk);
for(const x of [4.5,5.05]){b(.52,.48,.3,'#e2d599',x,2.05,.20,dk);b(.10,.018,.02,'#a7855b',x,1.91,.36,dk);}window(2.2,1.2,5.4,1.48,.015,dk);plant(5.4,.32,dk,.89,.6);
b(.7,1.9,.65,'#ecede2',3.88,.95,.45,dk);b(.65,.54,.025,'#f5f4e9',3.88,1.58,.79,dk);b(.65,1.22,.025,'#e2e6db',3.88,.67,.79,dk);for(const yy of [1.37,1.16])b(.045,.19,.04,'#acb9b1',4.10,yy,.82,dk);for(let i=0;i<4;i++)b(.1,.12,.006,['#da9f80','#9eb8bc','#c2c88c','#bda8ba'][i],3.7+(i%2)*.23,.9+Math.floor(i/2)*.26,.81,dk);
table(1.3,1.1,.75,5.25,2.1,dk).name='dining-table';for(const z of [1.7,2.45]){chair(4.45,z,Math.PI/2,dk);chair(6.25,z,-Math.PI/2,dk);}for(const x of [4.99,5.51]){cyl(.14,.018,'#eee8d1',x,.81,2.1,dk);bowl(x,.83,2.1,dk);rod([x+.16,.81,1.98],[x+.16,.81,2.22],.007,dark,dk);}
cupboard(.56,.78,.4,6.78,1.15,dk);b(.48,.34,.33,'#91b6a5',6.78,.99,1.15,dk);b(.32,.22,.018,'#405e5a',6.75,1.0,1.33,dk);cyl(.025,.016,'#d4d3b2',6.97,1.0,1.35,dk).rotation.x=Math.PI/2;
// Back-wall clock, plus ceiling fixtures visible with full wall height.
const clock=new T.Group();dk.add(clock);const rim=cyl(.14,.04,'#b18a58',6.96,2.15,.14,clock);rim.rotation.x=Math.PI/2;const face=cyl(.115,.045,'#f2eddc',6.96,2.15,.15,clock);face.rotation.x=Math.PI/2;rod([6.96,2.15,.18],[6.96,2.23,.18],.008,'#4c5e50',clock);rod([6.96,2.15,.18],[7.03,2.12,.18],.008,'#4c5e50',clock);
for(const [parent,x,z,w] of [[living,4.75,5.25,.65],[room,1.75,1.8,.5],[dk,5.25,2.1,.45]]){const g=new T.Group();g.name=parent.name+'-ceiling-light';parent.add(g);b(w+.08,.05,w+.08,trim,x,2.54,z,g);const lamp=b(w,.045,w,'#fff3d6',x,2.50,z,g);lamp.material=new T.MeshStandardMaterial({color:'#fff3d6',emissive:'#ffda91',emissiveIntensity:.25});g.userData.ceiling=true;fixtures.push(g);}
// Wet rooms: light blue tile, separate sink / washing machine / bathtub / WC.
const wet=group('wet-area-furnishings',1,'wash',['base-plan','current-04-layout']);for(const id of ['wash','bath','wc']){const r=plan.rooms.find(r=>r.id===id),[x,z,w,d]=r.rect;surface(w*.1-.1,d*.1-.1,tile,(x+w/2)*.1,(z+d/2)*.1,wet);}
b(1,.72,.42,'#dadbc7',7.83,.36,.67,wet);b(1.03,.06,.45,'#eeeedd',7.83,.75,.67,wet);b(.56,.03,.28,'#819b98',7.83,.79,.67,wet);rod([7.83,.78,.49],[7.83,.98,.49],.015,'#a5b6b0',wet);b(.75,.68,.03,'#adbcac',7.83,1.37,.44,wet);b(.65,.58,.02,'#c6dedb',7.83,1.37,.465,wet);
b(.56,.8,.57,'#a5c7c1',7.57,.4,1.5,wet);const washer=cyl(.20,.035,'#e8e5d5',7.57,.44,1.801,wet);washer.rotation.x=Math.PI/2;const washerGlass=cyl(.14,.04,'#5d8c8c',7.57,.44,1.825,wet);washerGlass.rotation.x=Math.PI/2;b(.44,.08,.025,'#e3e3cd',7.57,.71,1.8,wet);
// Hollow-looking tub from base, four sides and visible water surface.
b(1.16,.12,.72,'#e7eee0',9.25,.06,.94,wet);for(const x of [8.70,9.80])b(.10,.48,.72,'#e6ecde',x,.30,.94,wet);for(const z of [.61,1.27])b(1.16,.48,.10,'#e6ecde',9.25,.30,z,wet);b(.98,.025,.50,'#86bdc5',9.25,.34,.94,wet);rod([9.72,.59,.66],[9.55,.59,.66],.023,'#a9bcb6',wet);window(1.1,1.2,9.25,1.48,.415,wet);b(.35,.04,.32,'#eadbb1',9.6,.05,1.89,wet);cyl(.075,.01,'#758e87',9.08,.035,1.91,wet);
b(.46,.6,.23,'#e6e8dc',9.45,.3,2.55,wet);ball(.28,'#ecebdf',9.45,.22,2.91,wet,[.8,.75,1]);const seat=new T.Mesh(new T.TorusGeometry(.18,.036,10,24),mat('#f1efdf'));seat.rotation.x=Math.PI/2;seat.scale.set(1,1.25,1);seat.position.set(9.45,.40,2.91);wet.add(seat);cyl(.10,.01,'#647e78',9.45,.39,2.91,wet);b(.45,.03,.44,'#d3c7b1',9.45,.04,3.17,wet);
// Entry: shoe cabinet, threshold, tiled low area, slippers and framed mirror.
surface(2.6,.64,tile,8.6,7.65,hall,.025);b(1.9,.10,.08,'#9b784b',8.2,.06,7.3,hall);cupboard(.38,.85,1.25,9.66,7.0,hall);b(.05,1.1,.58,'#b59563',9.88,1.6,7.0,hall);b(.025,.96,.46,'#b4c9c3',9.84,1.6,7.0,hall);plant(9.63,6.7,hall,.90,.65);for(const x of [7.55,7.75])ball(.09,'#7b96a1',x,.08,7.65,hall,[.7,.4,1.4]);
// Front veranda, slim garden and laundry pole preserve indoor/outdoor relation.
const yard=new T.Group();base.add(yard);surface(5,.62,wood,4.7,7.55,yard,.01);for(const x of [2.3,7.1])b(.09,.25,.09,dark,x,-.05,7.6,yard);plant(1.65,7.9,yard,-.12,1.2);const laundryRack=new T.Group();laundryRack.name='laundry-rack';laundryRack.position.set(-.65,-.12,6.2);laundryRack.rotation.y=Math.PI/2;yard.add(laundryRack);
for(const x of [-.7,.7])rod([x,0,0],[x,1.8,0],.03,'#9bada2',laundryRack);rod([-.8,1.8,0],[.8,1.8,0],.025,'#9bada2',laundryRack);
for(let i=0;i<3;i++){const g=new T.Group();g.name='laundry-'+i;g.position.set(-.5+i*.4,1.76,0);g.userData={interaction:'collect-clothes',state:'hanging',source:'reference clothesline'};laundryRack.add(g);b(.31,.5,.015,['#ddcb9d','#99b9c4','#c694a3'][i],0,-.26,0,g);for(const x of [-.10,.10])b(.025,.07,.025,'#c69f6a',x,.01,0,g);}
// Upper-floor restrained study/guest room furnishing, based on the selected base plan only.
const upstairs=group('upper-study-furnishings',2,'upper-front',['base-plan']);surface(5.7,3.55,wood,5.25,4.3,upstairs);table(1.15,.6,.72,3.1,3.8,upstairs);chair(3.1,4.35,0,upstairs);b(.4,.3,.04,'#5e776f',3.1,.93,3.7,upstairs);cupboard(1.7,1.7,.35,6.4,2.7,upstairs);for(let i=0;i<12;i++)b(.07,.27,.1,['#729e9b','#c78c75','#d2ba71'][i%3],5.73+i*.11,1.52,2.91,upstairs);b(1.05,.20,1.8,'#bbcfde',4.2,.15,4.5,upstairs);b(.6,.13,.33,'#e1e9e2',4.2,.31,3.84,upstairs);
const guest=group('upper-guest-furnishings',2,'upper-back',['base-plan']);surface(5.7,2.2,tatami,5.25,1.2,guest);cupboard(1.5,1.8,.45,7.15,.35,guest);table(1,.65,.36,4.5,1.1,guest);window(3.5,1.2,4.75,1.48,.015,guest);
// Named decorative objects have source IDs; generate complete child geometry records for replay/audit.
for(const g of [living,room,dk,hall,wet,upstairs,guest])g.traverse(o=>{if(o.isMesh){o.userData.room=g.userData.room;manifest.push({id:g.name+'-mesh-'+seq++,parentId:g.name,generator:o.geometry.type,parameters:o.geometry.parameters,position:o.position.toArray(),rotation:o.rotation.toArray().slice(0,3),scale:o.scale.toArray(),sourceFeatureIds:g.userData.sources});}});
return {groups:[living,room,dk,hall,wet,upstairs,guest],setFull(full){for(const f of fixtures)f.visible=full&&!f.userData.ceiling;}};
}




