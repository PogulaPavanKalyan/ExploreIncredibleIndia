import{R as _e,I as We,F as ye,a as se,b as R,W as Ge,B as le,S as je,V as L,c as Le,U as oe,d as xe,e as ce,M as Ve,f as k,L as Je,g as $e,h as de,r,u as D,C as ue,_ as Y,i as qe,j as Q,k as Ke,l as Ye,m as Qe,n as Xe,o,p as Ze,q as Ce,s as et,t as tt,v as nt,w as it,x as at,y as st,z as ee}from"./index-GQ7-N_rz.js";const Me=parseInt(_e.replace(/\D+/g,"")),Ue=Me>=125?"uv1":"uv2",be=new le,$=new L;class fe extends We{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new ye(e,3)),this.setAttribute("uv",new ye(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new se(t,6,1);return this.setAttribute("instanceStart",new R(i,3,0)),this.setAttribute("instanceEnd",new R(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const n=new se(i,t*2,1);return this.setAttribute("instanceColorStart",new R(n,t,0)),this.setAttribute("instanceColorEnd",new R(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Ge(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new le);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),be.setFromBufferAttribute(t),this.boundingBox.union(be))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new je),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let a=0,d=e.count;a<d;a++)$.fromBufferAttribute(e,a),n=Math.max(n,i.distanceToSquared($)),$.fromBufferAttribute(t,a),n=Math.max(n,i.distanceToSquared($));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class Ne extends fe{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){const i=e.length-t,n=new Float32Array(2*i);if(t===3)for(let a=0;a<i;a+=t)n[2*a]=e[a],n[2*a+1]=e[a+1],n[2*a+2]=e[a+2],n[2*a+3]=e[a+3],n[2*a+4]=e[a+4],n[2*a+5]=e[a+5];else for(let a=0;a<i;a+=t)n[2*a]=e[a],n[2*a+1]=e[a+1],n[2*a+2]=e[a+2],n[2*a+3]=e[a+3],n[2*a+4]=e[a+4],n[2*a+5]=e[a+5],n[2*a+6]=e[a+6],n[2*a+7]=e[a+7];return super.setColors(n,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class he extends Le{constructor(e){super({type:"LineMaterial",uniforms:oe.clone(oe.merge([xe.common,xe.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ce(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${Me>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const te=new k,we=new L,Se=new L,b=new k,w=new k,N=new k,ne=new L,ie=new $e,S=new Je,Ae=new L,q=new le,K=new je,P=new k;let z,T;function Ee(s,e,t){return P.set(0,0,-e,1).applyMatrix4(s.projectionMatrix),P.multiplyScalar(1/P.w),P.x=T/t.width,P.y=T/t.height,P.applyMatrix4(s.projectionMatrixInverse),P.multiplyScalar(1/P.w),Math.abs(Math.max(P.x,P.y))}function ot(s,e){const t=s.matrixWorld,i=s.geometry,n=i.attributes.instanceStart,a=i.attributes.instanceEnd,d=Math.min(i.instanceCount,n.count);for(let l=0,f=d;l<f;l++){S.start.fromBufferAttribute(n,l),S.end.fromBufferAttribute(a,l),S.applyMatrix4(t);const h=new L,m=new L;z.distanceSqToSegment(S.start,S.end,m,h),m.distanceTo(h)<T*.5&&e.push({point:m,pointOnLine:h,distance:z.origin.distanceTo(m),object:s,face:null,faceIndex:l,uv:null,[Ue]:null})}}function rt(s,e,t){const i=e.projectionMatrix,a=s.material.resolution,d=s.matrixWorld,l=s.geometry,f=l.attributes.instanceStart,h=l.attributes.instanceEnd,m=Math.min(l.instanceCount,f.count),u=-e.near;z.at(1,N),N.w=1,N.applyMatrix4(e.matrixWorldInverse),N.applyMatrix4(i),N.multiplyScalar(1/N.w),N.x*=a.x/2,N.y*=a.y/2,N.z=0,ne.copy(N),ie.multiplyMatrices(e.matrixWorldInverse,d);for(let y=0,_=m;y<_;y++){if(b.fromBufferAttribute(f,y),w.fromBufferAttribute(h,y),b.w=1,w.w=1,b.applyMatrix4(ie),w.applyMatrix4(ie),b.z>u&&w.z>u)continue;if(b.z>u){const p=b.z-w.z,A=(b.z-u)/p;b.lerp(w,A)}else if(w.z>u){const p=w.z-b.z,A=(w.z-u)/p;w.lerp(b,A)}b.applyMatrix4(i),w.applyMatrix4(i),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=a.x/2,b.y*=a.y/2,w.x*=a.x/2,w.y*=a.y/2,S.start.copy(b),S.start.z=0,S.end.copy(w),S.end.z=0;const C=S.closestPointToPointParameter(ne,!0);S.at(C,Ae);const x=de.lerp(b.z,w.z,C),v=x>=-1&&x<=1,g=ne.distanceTo(Ae)<T*.5;if(v&&g){S.start.fromBufferAttribute(f,y),S.end.fromBufferAttribute(h,y),S.start.applyMatrix4(d),S.end.applyMatrix4(d);const p=new L,A=new L;z.distanceSqToSegment(S.start,S.end,A,p),t.push({point:A,pointOnLine:p,distance:z.origin.distanceTo(A),object:s,face:null,faceIndex:y,uv:null,[Ue]:null})}}}class Pe extends Ve{constructor(e=new fe,t=new he({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let d=0,l=0,f=t.count;d<f;d++,l+=2)we.fromBufferAttribute(t,d),Se.fromBufferAttribute(i,d),n[l]=l===0?0:n[l-1],n[l+1]=n[l]+we.distanceTo(Se);const a=new se(n,2,1);return e.setAttribute("instanceDistanceStart",new R(a,1,0)),e.setAttribute("instanceDistanceEnd",new R(a,1,1)),this}raycast(e,t){const i=this.material.worldUnits,n=e.camera;n===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const a=e.params.Line2!==void 0&&e.params.Line2.threshold||0;z=e.ray;const d=this.matrixWorld,l=this.geometry,f=this.material;T=f.linewidth+a,l.boundingSphere===null&&l.computeBoundingSphere(),K.copy(l.boundingSphere).applyMatrix4(d);let h;if(i)h=T*.5;else{const u=Math.max(n.near,K.distanceToPoint(z.origin));h=Ee(n,u,f.resolution)}if(K.radius+=h,z.intersectsSphere(K)===!1)return;l.boundingBox===null&&l.computeBoundingBox(),q.copy(l.boundingBox).applyMatrix4(d);let m;if(i)m=T*.5;else{const u=Math.max(n.near,q.distanceToPoint(z.origin));m=Ee(n,u,f.resolution)}q.expandByScalar(m),z.intersectsBox(q)!==!1&&(i?ot(this,t):rt(this,n,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(te),this.material.uniforms.resolution.value.set(te.z,te.w))}}class lt extends Pe{constructor(e=new Ne,t=new he({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const re=r.forwardRef(function({points:e,color:t=16777215,vertexColors:i,linewidth:n,lineWidth:a,segments:d,dashed:l,...f},h){var m,u;const y=D(v=>v.size),_=r.useMemo(()=>d?new Pe:new lt,[d]),[j]=r.useState(()=>new he),C=(i==null||(m=i[0])==null?void 0:m.length)===4?4:3,x=r.useMemo(()=>{const v=d?new fe:new Ne,g=e.map(p=>{const A=Array.isArray(p);return p instanceof L||p instanceof k?[p.x,p.y,p.z]:p instanceof ce?[p.x,p.y,0]:A&&p.length===3?[p[0],p[1],p[2]]:A&&p.length===2?[p[0],p[1],0]:p});if(v.setPositions(g.flat()),i){t=16777215;const p=i.map(A=>A instanceof ue?A.toArray():A);v.setColors(p.flat(),C)}return v},[e,d,i,C]);return r.useLayoutEffect(()=>{_.computeLineDistances()},[e,_]),r.useLayoutEffect(()=>{l?j.defines.USE_DASH="":delete j.defines.USE_DASH,j.needsUpdate=!0},[l,j]),r.useEffect(()=>()=>x.dispose(),[x]),r.createElement("primitive",Y({object:_,ref:h},f),r.createElement("primitive",{object:x,attach:"geometry"}),r.createElement("primitive",Y({object:j,attach:"material",color:t,vertexColors:!!i,resolution:[y.width,y.height],linewidth:(u=n??a)!==null&&u!==void 0?u:1,dashed:l,transparent:C===4},f)))});function ct(s,e,t,i){const n=class extends Le{constructor(d={}){const l=Object.entries(s);super({uniforms:l.reduce((f,[h,m])=>{const u=oe.clone({[h]:{value:m}});return{...f,...u}},{}),vertexShader:e,fragmentShader:t}),this.key="",l.forEach(([f])=>Object.defineProperty(this,f,{get:()=>this.uniforms[f].value,set:h=>this.uniforms[f].value=h})),Object.assign(this,d)}};return n.key=de.generateUUID(),n}const dt=()=>parseInt(_e.replace(/\D+/g,"")),ut=dt(),ft=r.forwardRef((s={enableDamping:!0},e)=>{const{domElement:t,camera:i,makeDefault:n,onChange:a,onStart:d,onEnd:l,...f}=s,h=D(g=>g.invalidate),m=D(g=>g.camera),u=D(g=>g.gl),y=D(g=>g.events),_=D(g=>g.set),j=D(g=>g.get),C=t||y.connected||u.domElement,x=i||m,v=r.useMemo(()=>new qe(x),[x]);return r.useEffect(()=>{v.connect(C);const g=p=>{h(),a&&a(p)};return v.addEventListener("change",g),d&&v.addEventListener("start",d),l&&v.addEventListener("end",l),()=>{v.dispose(),v.removeEventListener("change",g),d&&v.removeEventListener("start",d),l&&v.removeEventListener("end",l)}},[a,d,l,v,h,C]),r.useEffect(()=>{if(n){const g=j().controls;return _({controls:v}),()=>_({controls:g})}},[n,v]),Q(()=>v.update(),-1),r.createElement("primitive",Y({ref:e,object:v,enableDamping:!0},f))}),ht=ct({time:0,pixelRatio:1},` uniform float pixelRatio;
    uniform float time;
    attribute float size;  
    attribute float speed;  
    attribute float opacity;
    attribute vec3 noise;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vOpacity;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
      modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
      modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPostion = projectionMatrix * viewPosition;
      gl_Position = projectionPostion;
      gl_PointSize = size * 25. * pixelRatio;
      gl_PointSize *= (1.0 / - viewPosition.z);
      vColor = color;
      vOpacity = opacity;
    }`,` varying vec3 vColor;
    varying float vOpacity;
    void main() {
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float strength = 0.05 / distanceToCenter - 0.1;
      gl_FragColor = vec4(vColor, strength * vOpacity);
      #include <tonemapping_fragment>
      #include <${ut>=154?"colorspace_fragment":"encodings_fragment"}>
    }`),ze=s=>s&&s.constructor===Float32Array,pt=s=>[s.r,s.g,s.b],Ie=s=>s instanceof ce||s instanceof L||s instanceof k,Oe=s=>Array.isArray(s)?s:Ie(s)?s.toArray():[s,s,s];function G(s,e,t){return r.useMemo(()=>{if(e!==void 0){if(ze(e))return e;if(e instanceof ue){const i=Array.from({length:s*3},()=>pt(e)).flat();return Float32Array.from(i)}else if(Ie(e)||Array.isArray(e)){const i=Array.from({length:s*3},()=>Oe(e)).flat();return Float32Array.from(i)}return Float32Array.from({length:s},()=>e)}return Float32Array.from({length:s},t)},[e])}const mt=r.forwardRef(({noise:s=1,count:e=100,speed:t=1,opacity:i=1,scale:n=1,size:a,color:d,children:l,...f},h)=>{r.useMemo(()=>Ke({SparklesImplMaterial:ht}),[]);const m=r.useRef(null),u=D(p=>p.viewport.dpr),y=Oe(n),_=r.useMemo(()=>Float32Array.from(Array.from({length:e},()=>y.map(de.randFloatSpread)).flat()),[e,...y]),j=G(e,a,Math.random),C=G(e,i),x=G(e,t),v=G(e*3,s),g=G(d===void 0?e*3:e,ze(d)?d:new ue(d),()=>1);return Q(p=>{m.current&&m.current.material&&(m.current.material.time=p.clock.elapsedTime)}),r.useImperativeHandle(h,()=>m.current,[]),r.createElement("points",Y({key:`particle-${e}-${JSON.stringify(n)}`},f,{ref:m}),r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[_,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[j,1]}),r.createElement("bufferAttribute",{attach:"attributes-opacity",args:[C,1]}),r.createElement("bufferAttribute",{attach:"attributes-speed",args:[x,1]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[g,3]}),r.createElement("bufferAttribute",{attach:"attributes-noise",args:[v,3]})),l||r.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:u,depthWrite:!1}))});function gt({mapData:s,hoveredState:e,onHoverState:t,selectedState:i,onSelectState:n,reducedMotion:a}){const d=r.useRef(),l=r.useMemo(()=>s?Ye(s):[],[s]),f=r.useMemo(()=>!s||l.length>0?[]:Qe(s,.08),[s,l]),h=r.useMemo(()=>!s||l.length>0?[]:Xe(s),[s,l]),m=r.useMemo(()=>({depth:.15,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.03,bevelThickness:.03}),[]);return o.jsxs("group",{ref:d,children:[l.length>0&&o.jsx("group",{children:l.map((u,y)=>{const _=!!e&&(e.id===u.id||e.name&&u.name&&e.name.toLowerCase()===u.name.toLowerCase()||e.rawName&&u.rawName&&e.rawName.toLowerCase()===u.rawName.toLowerCase()),j=!!i&&(i.id===u.id||i.name&&u.name&&i.name.toLowerCase()===u.name.toLowerCase()||i.rawName&&u.rawName&&i.rawName.toLowerCase()===u.rawName.toLowerCase());return o.jsx(Ze,{stateFeature:u,isHovered:_,isSelected:j,isAnyStateHovered:!!e,onHoverState:t,onSelectState:n,reducedMotion:a},u.id||`state-${y}`)})}),l.length===0&&o.jsxs("group",{children:[h.map((u,y)=>o.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.07,0],children:[o.jsx("extrudeGeometry",{args:[u,m]}),o.jsx("meshStandardMaterial",{color:"#111827",roughness:.4,metalness:.5,emissive:"#0f172a",emissiveIntensity:.3})]},`fallback-shape-${y}`)),f.map((u,y)=>o.jsx(re,{points:u,color:"#d97706",lineWidth:2,transparent:!0,opacity:.8},`fallback-line-${y}`))]}),o.jsx("gridHelper",{args:[45,45,"#d97706","#1e293b"],position:[0,-.25,0]}),o.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.26,0],children:[o.jsx("planeGeometry",{args:[120,120]}),o.jsx("meshBasicMaterial",{color:"#030712",transparent:!0,opacity:.96})]}),!a&&o.jsx(mt,{count:30,scale:[30,5,30],size:1.8,speed:.2,opacity:.35,color:"#f59e0b",position:[0,.7,0]})]})}function vt({destinations:s,isCinematic:e,reducedMotion:t}){const i=r.useMemo(()=>{if(!Array.isArray(s)||s.length<2)return null;const l=s.map((f,h)=>{const m=Ce(f.latitude,f.longitude,.2),u=Math.sin(h/(s.length-1)*Math.PI)*.8;return new L(m[0],m[1]+u,m[2])});return new et(l,!1,"catmullrom",.5)},[s]),n=r.useRef(0),a=r.useRef();if(Q((l,f)=>{if(e&&!t&&i&&a.current){n.current=l.clock.elapsedTime*.1%1;const h=i.getPoint(n.current);a.current.position.copy(h)}}),!i||!e)return null;const d=i.getPoints(100);return o.jsxs("group",{children:[o.jsx(re,{points:d,color:"#38bdf8",lineWidth:3,transparent:!0,opacity:.8,dashed:!0,dashSize:.5,dashScale:1.5}),o.jsx(re,{points:d,color:"#fbbf24",lineWidth:6,transparent:!0,opacity:.25}),!t&&o.jsxs("group",{ref:a,children:[o.jsxs("mesh",{children:[o.jsx("sphereGeometry",{args:[.12,16,16]}),o.jsx("meshBasicMaterial",{color:"#ffffff"})]}),o.jsx("pointLight",{color:"#38bdf8",intensity:4,distance:4})]})]})}const I=[{id:"f1",destination:"Taj Mahal, Agra",slug:"taj-mahal",state:"Uttar Pradesh",region:"North India",latitude:27.1751,longitude:78.0421,image:"https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",short_description:"An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of Mughal emperor Shah Jahan.",category:"Heritage"},{id:"f2",destination:"Leh & Ladakh",slug:"leh-ladakh",state:"Ladakh",region:"North India",latitude:34.1526,longitude:77.5771,image:"https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800",short_description:"High-altitude cold desert surrounded by breathtaking snow-capped mountain peaks, ancient monasteries, and lakes.",category:"Adventure"},{id:"f3",destination:"Varanasi Ghats",slug:"varanasi",state:"Uttar Pradesh",region:"North India",latitude:25.3176,longitude:82.9739,image:"https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",short_description:"The spiritual heart of India along the sacred Ganges river, famed for ancient ghats and evening Ganga Aarti.",category:"Spiritual"},{id:"f4",destination:"Jaipur Pink City",slug:"jaipur",state:"Rajasthan",region:"West India",latitude:26.9239,longitude:75.8267,image:"https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",short_description:"Capital of Rajasthan featuring iconic royal palaces like Hawa Mahal and Amber Fort with vibrant bazaars.",category:"Culture"},{id:"f5",destination:"Goa Coastline",slug:"goa",state:"Goa",region:"West India",latitude:15.2993,longitude:74.124,image:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",short_description:"Sun-drenched golden beaches, Portuguese heritage churches, lively beach shacks, and tropical spice plantations.",category:"Beaches"},{id:"f6",destination:"Munnar Hills",slug:"munnar",state:"Kerala",region:"South India",latitude:10.0889,longitude:77.0595,image:"https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",short_description:"Picturesque hill station in God’s Own Country, famed for sprawling tea gardens and misty mountain peaks.",category:"Nature"},{id:"f7",destination:"Hampi Ruins",slug:"hampi",state:"Karnataka",region:"South India",latitude:15.335,longitude:76.46,image:"https://images.unsplash.com/photo-1600100397608-f010e423b971?w=800",short_description:"UNESCO World Heritage Site with surreal boulder landscapes and stone temples of the Vijayanagara Empire.",category:"Heritage"},{id:"f8",destination:"Darjeeling Tea Hills",slug:"darjeeling",state:"West Bengal",region:"East India",latitude:27.041,longitude:88.2663,image:"https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",short_description:"Queen of the Hills offering views of Mount Kanchenjunga, world-renowned tea gardens, and Himalayan Railway.",category:"Nature"},{id:"f9",destination:"Kaziranga Reserve",slug:"kaziranga",state:"Assam",region:"Northeast India",latitude:26.5775,longitude:93.1711,image:"https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800",short_description:"Home to two-thirds of the world’s one-horned rhinos, lush elephant grass marshes, and rich wildlife safaris.",category:"Wildlife"},{id:"f10",destination:"Khajuraho Temples",slug:"khajuraho",state:"Madhya Pradesh",region:"Central India",latitude:24.8318,longitude:79.9199,image:"https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800",short_description:"Famous group of medieval Hindu and Jain temples renowned for their intricate stone carvings and grandeur.",category:"Heritage"},{id:"f11",destination:"Golden Temple, Amritsar",slug:"golden-temple",state:"Punjab",region:"North India",latitude:31.62,longitude:74.8765,image:"https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=800",short_description:"Holiest shrine of Sikhism, surrounded by a sacred pool of nectar, radiating peace and community service.",category:"Spiritual"},{id:"f12",destination:"Mysore Palace",slug:"mysore",state:"Karnataka",region:"South India",latitude:12.3051,longitude:76.6551,image:"https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",short_description:"Grand royal residence of the Wadiyar dynasty featuring Indo-Saracenic architecture and illuminated domes.",category:"Culture"},{id:"f13",destination:"Charminar, Hyderabad",slug:"charminar-hyderabad",state:"Telangana",region:"South India",latitude:17.3616,longitude:78.4747,image:"https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",short_description:"Iconic 16th-century mosque with four ornate minarets located in the heart of historic Hyderabad.",category:"Heritage"},{id:"f14",destination:"Tirumala Venkateswara Temple",slug:"tirupati-temple",state:"Andhra Pradesh",region:"South India",latitude:13.6833,longitude:79.35,image:"https://images.unsplash.com/photo-1621831971712-421714207865?w=800",short_description:"Sacred hill shrine dedicated to Lord Venkateswara on the Tirumala Hills, celebrated worldwide.",category:"Spiritual"}],ae=[{id:1,name:"North India"},{id:2,name:"South India"},{id:3,name:"West India"},{id:4,name:"East India"},{id:5,name:"Central India"},{id:6,name:"Northeast India"}];function wt(){const[s,e]=r.useState(I),[t,i]=r.useState(I.slice(0,6)),[n,a]=r.useState(ae),[d,l]=r.useState("ALL"),[f,h]=r.useState(I[0]),[m,u]=r.useState(null),[y,_]=r.useState(null),[j,C]=r.useState(!1),[x,v]=r.useState(!1),[g,p]=r.useState(0),[A,pe]=r.useState(null),V=window.matchMedia("(prefers-reduced-motion: reduce)").matches,U=r.useRef(null),[Be,X]=r.useState(!1),[yt,De]=r.useState(null);r.useEffect(()=>{fetch("/india_states.json").then(c=>c.json()).then(c=>pe(c)).catch(()=>{fetch("/india.json").then(c=>c.json()).then(c=>pe(c)).catch(c=>console.error("Failed to load India GeoJSON map:",c))})},[]);const Te=()=>{X(!0),De(null),Promise.all([ee.get("/journey/destinations/").catch(()=>null),ee.get("/journey/regions/").catch(()=>null),ee.get("/journey/featured/").catch(()=>null)]).then(([c,E,M])=>{var W,ge,ve;const O=((W=c==null?void 0:c.data)==null?void 0:W.data)||(c==null?void 0:c.data);Array.isArray(O)&&O.length>0?(e(O),h(O[0])):(e(I),h(I[0]));const B=((ge=E==null?void 0:E.data)==null?void 0:ge.data)||(E==null?void 0:E.data);Array.isArray(B)&&B.length>0?a(B):a(ae);const J=((ve=M==null?void 0:M.data)==null?void 0:ve.data)||(M==null?void 0:M.data);Array.isArray(J)&&J.length>0?i(J):i(I.slice(0,6)),X(!1)}).catch(()=>{e(I),h(I[0]),a(ae),i(I.slice(0,6)),X(!1)})};r.useEffect(()=>{Te()},[]);const H=r.useMemo(()=>d==="ALL"?s:s.filter(c=>(c.region||"").toUpperCase()===d.toUpperCase()),[s,d]);r.useEffect(()=>{H.length>0?d==="ALL"||f&&(f.region||"").toUpperCase()===d.toUpperCase()||h(H[0]):h(null)},[H,d]),r.useEffect(()=>{let c;return x&&t.length>0&&(h(t[g]),c=setInterval(()=>{p(E=>(E+1)%t.length)},5e3)),()=>clearInterval(c)},[x,g,t]),r.useEffect(()=>{x&&t.length>0&&h(t[g])},[g,x,t]);const ke=()=>{v(!0),p(0),l("ALL")},F=()=>{v(!1)},He=()=>{F(),u(null),U.current&&(U.current.target.set(0,0,0),U.current.object.position.set(0,6,9),U.current.update())},Z=c=>{F(),h(c)},me=tt(),Re=c=>{if(F(),c&&c.name){const E=c.name.toLowerCase().replace(/\s+/g,"-");me(`/states/${E}`)}else if(typeof c=="string"){const E=c.toLowerCase().replace(/\s+/g,"-");me(`/states/${E}`)}},Fe=({activeDest:c,isCinematic:E})=>(Q(M=>{if(!U.current||!c||V)return;const O=Ce(c.latitude,c.longitude,0),B=new L(O[0],O[1],O[2]);if(U.current.target.distanceTo(B)>.001&&(U.current.target.lerp(B,.06),U.current.update()),E){const W=new L(B.x*.8,3.8,B.z+4.5);M.camera.position.distanceTo(W)>.001&&(M.camera.position.lerp(W,.03),U.current.update())}}),null);return o.jsxs(nt.section,{className:"journey-section",initial:{opacity:0},animate:{opacity:1},transition:{duration:.8},"aria-label":"Interactive 3D Journey Across India",children:[o.jsxs("div",{className:"journey-header",children:[o.jsxs("div",{className:"journey-title-container",children:[o.jsx("span",{className:"badge badge-gold",children:"Interactive 3D Experience"}),o.jsx("h2",{className:"journey-main-title",children:"Journey Across India"}),o.jsx("p",{className:"journey-subtitle",children:"Click any state to launch 3D District Explorer or fly across landmarks"})]}),o.jsx("div",{className:"region-filter-tabs",role:"tablist","aria-label":"Filter destinations by region",children:n.map(c=>o.jsx("button",{role:"tab","aria-selected":d===c.code,className:`region-tab-btn ${d===c.code?"active":""}`,onClick:()=>{F(),l(c.code)},children:c.name},c.id||c.code))})]}),o.jsxs("div",{className:"journey-workspace-split",children:[o.jsxs("div",{className:"journey-map-column",children:[o.jsx("button",{className:"reset-view-btn",onClick:He,title:"Reset Camera to All India View","aria-label":"Reset Camera View",children:"🎯 Reset View"}),o.jsx("div",{className:"canvas-wrapper",children:o.jsxs(it,{camera:{position:[0,6,9],fov:45},dpr:[1,1.5],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},children:[o.jsx("ambientLight",{intensity:1.2}),o.jsx("directionalLight",{position:[10,20,15],intensity:2.5,color:"#ffffff"}),o.jsx("directionalLight",{position:[-10,15,-10],intensity:1,color:"#38bdf8"}),o.jsx(gt,{mapData:A,hoveredState:y,onHoverState:_,selectedState:m,onSelectState:Re,reducedMotion:V}),o.jsx(vt,{destinations:H,activeDestination:f,reducedMotion:V}),o.jsx(at,{destinations:H,activeDestination:f,hoveredState:y,selectedState:m,onSelect:Z,reducedMotion:V}),o.jsx(ft,{ref:U,enablePan:!0,enableZoom:!0,enableRotate:!0,maxPolarAngle:Math.PI/2.15,minDistance:3,maxDistance:18,dampingFactor:.05}),o.jsx(Fe,{activeDest:f,isCinematic:x})]})})]}),o.jsxs("div",{className:"journey-places-sidebar-column",children:[o.jsxs("div",{className:"sidebar-header-box",children:[o.jsx("div",{className:"sidebar-badge",children:"✨ Featured Landmarks"}),o.jsx("h3",{className:"sidebar-title",children:"Important Places Across India"}),o.jsx("p",{className:"sidebar-sub",children:"Click any landmark card to fly 3D camera to its location"})]}),o.jsx("div",{className:"places-carousel-list",children:H.map(c=>{const E=f&&(f.id===c.id||f.destination===c.destination);return o.jsxs("div",{onClick:()=>Z(c),className:`landmark-card-item ${E?"active":""}`,children:[o.jsxs("div",{className:"landmark-thumb",children:[o.jsx("img",{src:c.image,alt:c.destination,loading:"lazy"}),o.jsx("span",{className:"landmark-state-badge",children:c.state})]}),o.jsxs("div",{className:"landmark-info",children:[o.jsxs("div",{className:"landmark-title-row",children:[o.jsx("h4",{className:"landmark-name",children:c.destination}),o.jsx("span",{className:"landmark-category",children:c.category})]}),o.jsx("p",{className:"landmark-desc",children:c.short_description}),o.jsx("div",{className:"landmark-footer-row",children:o.jsx("button",{onClick:M=>{M.stopPropagation(),Z(c)},className:"fly-pin-btn",children:"📍 Fly to Landmark"})})]})]},c.id||c.destination)})})]})]}),o.jsxs("div",{className:"journey-controls-row",children:[o.jsx("button",{className:`start-journey-btn ${x?"active":""}`,onClick:x?F:ke,disabled:Be||!f,"aria-label":x?"Stop cinematic journey":"Start cinematic journey across India",children:x?"■ STOP JOURNEY":"▶ START CINEMATIC JOURNEY"}),o.jsx("span",{className:"storytelling-text",children:"One land. 1000+ timeless stories."})]}),j&&o.jsx(st,{stateItem:m,onClose:()=>C(!1)})]})}export{wt as JourneyAcrossIndia};
