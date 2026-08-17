import{R as pe,I as Me,F as se,a as X,b as R,W as Ce,B as Q,S as me,V as A,c as he,U as K,d as oe,e as Z,M as Ue,f as B,L as Oe,g as ze,h as ee,r as l,u as z,C as te,_ as G,i as Pe,j as I,k as Be,l as Re,m as r,H as Ie,n as De,A as Ne,o as ge,p as Te,q as He,s as Fe,t as $,v as We}from"./index-cEfNAV-y.js";const ve=parseInt(pe.replace(/\D+/g,"")),ye=ve>=125?"uv1":"uv2",re=new Q,H=new A;class ne extends Me{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new se(e,3)),this.setAttribute("uv",new se(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new X(t,6,1);return this.setAttribute("instanceStart",new R(i,3,0)),this.setAttribute("instanceEnd",new R(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const n=new X(i,t*2,1);return this.setAttribute("instanceColorStart",new R(n,t,0)),this.setAttribute("instanceColorEnd",new R(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Ce(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Q);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),re.setFromBufferAttribute(t),this.boundingBox.union(re))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new me),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let s=0,c=e.count;s<c;s++)H.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(H)),H.fromBufferAttribute(t,s),n=Math.max(n,i.distanceToSquared(H));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class xe extends ne{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){const i=e.length-t,n=new Float32Array(2*i);if(t===3)for(let s=0;s<i;s+=t)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];else for(let s=0;s<i;s+=t)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5],n[2*s+6]=e[s+6],n[2*s+7]=e[s+7];return super.setColors(n,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class ie extends he{constructor(e){super({type:"LineMaterial",uniforms:K.clone(K.merge([oe.common,oe.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Z(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${ve>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const q=new B,ae=new A,ce=new A,S=new B,b=new B,C=new B,J=new A,Y=new ze,w=new Oe,le=new A,F=new Q,W=new me,U=new B;let O,P;function fe(o,e,t){return U.set(0,0,-e,1).applyMatrix4(o.projectionMatrix),U.multiplyScalar(1/U.w),U.x=P/t.width,U.y=P/t.height,U.applyMatrix4(o.projectionMatrixInverse),U.multiplyScalar(1/U.w),Math.abs(Math.max(U.x,U.y))}function Ge(o,e){const t=o.matrixWorld,i=o.geometry,n=i.attributes.instanceStart,s=i.attributes.instanceEnd,c=Math.min(i.instanceCount,n.count);for(let a=0,f=c;a<f;a++){w.start.fromBufferAttribute(n,a),w.end.fromBufferAttribute(s,a),w.applyMatrix4(t);const u=new A,d=new A;O.distanceSqToSegment(w.start,w.end,d,u),d.distanceTo(u)<P*.5&&e.push({point:d,pointOnLine:u,distance:O.origin.distanceTo(d),object:o,face:null,faceIndex:a,uv:null,[ye]:null})}}function ke(o,e,t){const i=e.projectionMatrix,s=o.material.resolution,c=o.matrixWorld,a=o.geometry,f=a.attributes.instanceStart,u=a.attributes.instanceEnd,d=Math.min(a.instanceCount,f.count),g=-e.near;O.at(1,C),C.w=1,C.applyMatrix4(e.matrixWorldInverse),C.applyMatrix4(i),C.multiplyScalar(1/C.w),C.x*=s.x/2,C.y*=s.y/2,C.z=0,J.copy(C),Y.multiplyMatrices(e.matrixWorldInverse,c);for(let m=0,_=d;m<_;m++){if(S.fromBufferAttribute(f,m),b.fromBufferAttribute(u,m),S.w=1,b.w=1,S.applyMatrix4(Y),b.applyMatrix4(Y),S.z>g&&b.z>g)continue;if(S.z>g){const p=S.z-b.z,x=(S.z-g)/p;S.lerp(b,x)}else if(b.z>g){const p=b.z-S.z,x=(b.z-g)/p;b.lerp(S,x)}S.applyMatrix4(i),b.applyMatrix4(i),S.multiplyScalar(1/S.w),b.multiplyScalar(1/b.w),S.x*=s.x/2,S.y*=s.y/2,b.x*=s.x/2,b.y*=s.y/2,w.start.copy(S),w.start.z=0,w.end.copy(b),w.end.z=0;const L=w.closestPointToPointParameter(J,!0);w.at(L,le);const E=ee.lerp(S.z,b.z,L),h=E>=-1&&E<=1,v=J.distanceTo(le)<P*.5;if(h&&v){w.start.fromBufferAttribute(f,m),w.end.fromBufferAttribute(u,m),w.start.applyMatrix4(c),w.end.applyMatrix4(c);const p=new A,x=new A;O.distanceSqToSegment(w.start,w.end,x,p),t.push({point:x,pointOnLine:p,distance:O.origin.distanceTo(x),object:o,face:null,faceIndex:m,uv:null,[ye]:null})}}}class Se extends Ue{constructor(e=new ne,t=new ie({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let c=0,a=0,f=t.count;c<f;c++,a+=2)ae.fromBufferAttribute(t,c),ce.fromBufferAttribute(i,c),n[a]=a===0?0:n[a-1],n[a+1]=n[a]+ae.distanceTo(ce);const s=new X(n,2,1);return e.setAttribute("instanceDistanceStart",new R(s,1,0)),e.setAttribute("instanceDistanceEnd",new R(s,1,1)),this}raycast(e,t){const i=this.material.worldUnits,n=e.camera;n===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const s=e.params.Line2!==void 0&&e.params.Line2.threshold||0;O=e.ray;const c=this.matrixWorld,a=this.geometry,f=this.material;P=f.linewidth+s,a.boundingSphere===null&&a.computeBoundingSphere(),W.copy(a.boundingSphere).applyMatrix4(c);let u;if(i)u=P*.5;else{const g=Math.max(n.near,W.distanceToPoint(O.origin));u=fe(n,g,f.resolution)}if(W.radius+=u,O.intersectsSphere(W)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),F.copy(a.boundingBox).applyMatrix4(c);let d;if(i)d=P*.5;else{const g=Math.max(n.near,F.distanceToPoint(O.origin));d=fe(n,g,f.resolution)}F.expandByScalar(d),O.intersectsBox(F)!==!1&&(i?Ge(this,t):ke(this,n,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(q),this.material.uniforms.resolution.value.set(q.z,q.w))}}class Ve extends Se{constructor(e=new xe,t=new ie({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const be=l.forwardRef(function({points:e,color:t=16777215,vertexColors:i,linewidth:n,lineWidth:s,segments:c,dashed:a,...f},u){var d,g;const m=z(h=>h.size),_=l.useMemo(()=>c?new Se:new Ve,[c]),[M]=l.useState(()=>new ie),L=(i==null||(d=i[0])==null?void 0:d.length)===4?4:3,E=l.useMemo(()=>{const h=c?new ne:new xe,v=e.map(p=>{const x=Array.isArray(p);return p instanceof A||p instanceof B?[p.x,p.y,p.z]:p instanceof Z?[p.x,p.y,0]:x&&p.length===3?[p[0],p[1],p[2]]:x&&p.length===2?[p[0],p[1],0]:p});if(h.setPositions(v.flat()),i){t=16777215;const p=i.map(x=>x instanceof te?x.toArray():x);h.setColors(p.flat(),L)}return h},[e,c,i,L]);return l.useLayoutEffect(()=>{_.computeLineDistances()},[e,_]),l.useLayoutEffect(()=>{a?M.defines.USE_DASH="":delete M.defines.USE_DASH,M.needsUpdate=!0},[a,M]),l.useEffect(()=>()=>E.dispose(),[E]),l.createElement("primitive",G({object:_,ref:u},f),l.createElement("primitive",{object:E,attach:"geometry"}),l.createElement("primitive",G({object:M,attach:"material",color:t,vertexColors:!!i,resolution:[m.width,m.height],linewidth:(g=n??s)!==null&&g!==void 0?g:1,dashed:a,transparent:L===4},f)))});function $e(o,e,t,i){const n=class extends he{constructor(c={}){const a=Object.entries(o);super({uniforms:a.reduce((f,[u,d])=>{const g=K.clone({[u]:{value:d}});return{...f,...g}},{}),vertexShader:e,fragmentShader:t}),this.key="",a.forEach(([f])=>Object.defineProperty(this,f,{get:()=>this.uniforms[f].value,set:u=>this.uniforms[f].value=u})),Object.assign(this,c)}};return n.key=ee.generateUUID(),n}const qe=()=>parseInt(pe.replace(/\D+/g,"")),Je=qe(),Ye=l.forwardRef((o={enableDamping:!0},e)=>{const{domElement:t,camera:i,makeDefault:n,onChange:s,onStart:c,onEnd:a,...f}=o,u=z(v=>v.invalidate),d=z(v=>v.camera),g=z(v=>v.gl),m=z(v=>v.events),_=z(v=>v.set),M=z(v=>v.get),L=t||m.connected||g.domElement,E=i||d,h=l.useMemo(()=>new Pe(E),[E]);return l.useEffect(()=>{h.connect(L);const v=p=>{u(),s&&s(p)};return h.addEventListener("change",v),c&&h.addEventListener("start",c),a&&h.addEventListener("end",a),()=>{h.dispose(),h.removeEventListener("change",v),c&&h.removeEventListener("start",c),a&&h.removeEventListener("end",a)}},[s,c,a,h,u,L]),l.useEffect(()=>{if(n){const v=M().controls;return _({controls:h}),()=>_({controls:v})}},[n,h]),I(()=>h.update(),-1),l.createElement("primitive",G({ref:e,object:h,enableDamping:!0},f))}),Xe=$e({time:0,pixelRatio:1},` uniform float pixelRatio;
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
      #include <${Je>=154?"colorspace_fragment":"encodings_fragment"}>
    }`),we=o=>o&&o.constructor===Float32Array,Ke=o=>[o.r,o.g,o.b],Ee=o=>o instanceof Z||o instanceof A||o instanceof B,Ae=o=>Array.isArray(o)?o:Ee(o)?o.toArray():[o,o,o];function D(o,e,t){return l.useMemo(()=>{if(e!==void 0){if(we(e))return e;if(e instanceof te){const i=Array.from({length:o*3},()=>Ke(e)).flat();return Float32Array.from(i)}else if(Ee(e)||Array.isArray(e)){const i=Array.from({length:o*3},()=>Ae(e)).flat();return Float32Array.from(i)}return Float32Array.from({length:o},()=>e)}return Float32Array.from({length:o},t)},[e])}const Qe=l.forwardRef(({noise:o=1,count:e=100,speed:t=1,opacity:i=1,scale:n=1,size:s,color:c,children:a,...f},u)=>{l.useMemo(()=>Be({SparklesImplMaterial:Xe}),[]);const d=l.useRef(null),g=z(p=>p.viewport.dpr),m=Ae(n),_=l.useMemo(()=>Float32Array.from(Array.from({length:e},()=>m.map(ee.randFloatSpread)).flat()),[e,...m]),M=D(e,s,Math.random),L=D(e,i),E=D(e,t),h=D(e*3,o),v=D(c===void 0?e*3:e,we(c)?c:new te(c),()=>1);return I(p=>{d.current&&d.current.material&&(d.current.material.time=p.clock.elapsedTime)}),l.useImperativeHandle(u,()=>d.current,[]),l.createElement("points",G({key:`particle-${e}-${JSON.stringify(n)}`},f,{ref:d}),l.createElement("bufferGeometry",null,l.createElement("bufferAttribute",{attach:"attributes-position",args:[_,3]}),l.createElement("bufferAttribute",{attach:"attributes-size",args:[M,1]}),l.createElement("bufferAttribute",{attach:"attributes-opacity",args:[L,1]}),l.createElement("bufferAttribute",{attach:"attributes-speed",args:[E,1]}),l.createElement("bufferAttribute",{attach:"attributes-color",args:[v,3]}),l.createElement("bufferAttribute",{attach:"attributes-noise",args:[h,3]})),a||l.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:g,depthWrite:!1}))}),de={lat:22.5,lng:82.5},ue=.5;function N(o,e,t=0){const i=o-de.lat,s=(e-de.lng)*ue,c=-i*ue;return[s,t,c]}function Ze(o,e=0){const t=[];if(!o||!o.geometry)return t;const i=o.geometry.type,n=o.geometry.coordinates;return i==="Polygon"?n.forEach(s=>{const c=s.map(a=>N(a[1],a[0],e));t.push(c)}):i==="MultiPolygon"&&n.forEach(s=>{s.forEach(c=>{const a=c.map(f=>N(f[1],f[0],e));t.push(a)})}),t}function et({mapData:o,reducedMotion:e}){const t=l.useMemo(()=>o?Ze(o,0):[],[o]),i=Re.useRef();return I(n=>{if(!e&&i.current){const s=n.clock.getElapsedTime();i.current.position.y=Math.sin(s*.5)*.2-.5}}),t.length===0?null:r.jsxs("group",{ref:i,children:[t.map((n,s)=>r.jsx(be,{points:n,color:"#cda87c",lineWidth:1.5,transparent:!0,opacity:.6},s)),r.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.1,0],children:[r.jsx("planeGeometry",{args:[100,100]}),r.jsx("meshBasicMaterial",{color:"#050508",transparent:!0,opacity:.8})]}),!e&&r.jsx(Qe,{count:100,scale:[20,2,20],size:2,speed:.2,opacity:.3,color:"#ffffff",position:[0,.5,0]})]})}function tt({destination:o,isActive:e,onClick:t,reducedMotion:i}){const[n,s]=l.useState(!1),c=N(o.latitude,o.longitude,0),a=l.useRef(),f=l.useRef();I((d,g)=>{if(!i){if(e&&f.current){f.current.rotation.x+=g,f.current.rotation.y+=g*.5;const m=1+Math.sin(d.clock.elapsedTime*3)*.2;f.current.scale.set(m,m,m)}if(a.current){const m=e||n?1.5:1;a.current.scale.lerp(new A(m,m,m),.1)}}});const u=e?"#ffffff":"#cda87c";return r.jsxs("group",{position:c,onClick:d=>{d.stopPropagation(),t()},onPointerOver:()=>s(!0),onPointerOut:()=>s(!1),children:[r.jsxs("mesh",{ref:a,children:[r.jsx("sphereGeometry",{args:[.15,16,16]}),r.jsx("meshBasicMaterial",{color:u})]}),e&&r.jsxs("mesh",{ref:f,children:[r.jsx("torusGeometry",{args:[.3,.05,8,24]}),r.jsx("meshBasicMaterial",{color:"#ffffff",transparent:!0,opacity:.8})]}),r.jsx(Ie,{distanceFactor:15,center:!0,position:[0,.5,0],style:{pointerEvents:"none"},children:r.jsx("div",{style:{color:e?"#fff":"rgba(255,255,255,0.7)",fontWeight:e?"700":"400",fontSize:"14px",textShadow:"0 2px 4px rgba(0,0,0,0.8)",whiteSpace:"nowrap",transform:e?"scale(1.1)":"scale(1)",transition:"transform 0.3s ease"},children:o.destination})})]})}function nt({destinations:o,activeDestination:e,onSelect:t,reducedMotion:i}){return o?r.jsx("group",{children:Array.isArray(o)&&o.map(n=>r.jsx(tt,{destination:n,isActive:e&&e.id===n.id,onClick:()=>t(n),reducedMotion:i},n.id))}):null}function it({destinations:o,activeIndex:e,isCinematic:t,reducedMotion:i}){const n=l.useMemo(()=>{if(!Array.isArray(o)||o.length<2)return null;const f=o.map(u=>{const d=N(u.latitude,u.longitude,0);return new A(...d)});return new De(f,!1,"catmullrom",.5)},[o]),s=l.useRef(0),c=l.useRef();if(I((f,u)=>{if(t&&!i&&n&&c.current){s.current=f.clock.elapsedTime*.1%1;const d=n.getPoint(s.current);c.current.position.copy(d)}}),!n||!t)return null;const a=n.getPoints(50);return r.jsxs("group",{children:[r.jsx(be,{points:a,color:"#cda87c",lineWidth:2,transparent:!0,opacity:.3,dashed:!0,dashSize:.5,dashScale:1,dashOffset:0}),!i&&r.jsxs("mesh",{ref:c,children:[r.jsx("sphereGeometry",{args:[.08,16,16]}),r.jsx("meshBasicMaterial",{color:"#ffffff"}),r.jsx("pointLight",{color:"#ffffff",intensity:2,distance:2})]})]})}function st({regions:o,activeRegion:e,setActiveRegion:t,activeDestination:i,isCinematic:n,startJourney:s,stopJourney:c}){var a,f;return r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"journey-filters",children:[r.jsx("button",{className:`filter-btn ${e==="ALL"?"active":""}`,onClick:()=>{t("ALL"),c()},children:"ALL INDIA"}),Array.isArray(o)&&o.map(u=>r.jsx("button",{className:`filter-btn ${e===u.name?"active":""}`,onClick:()=>{t(u.name),c()},children:u.name.toUpperCase()},u.id))]}),r.jsx("div",{className:"journey-info-panel",children:r.jsx(Ne,{mode:"wait",children:i&&r.jsxs(ge.div,{className:"info-card",initial:{opacity:0,x:50},animate:{opacity:1,x:0},exit:{opacity:0,x:-50},transition:{duration:.5,ease:"easeOut"},children:[r.jsx("span",{className:"info-region",children:i.region}),r.jsx("h3",{className:"info-title",children:i.destination}),r.jsx("span",{className:"info-state",children:i.state}),r.jsx("div",{className:"info-image-container",children:r.jsx("img",{src:i.image||"https://via.placeholder.com/400x200?text=No+Image",alt:i.destination,className:"info-image"})}),r.jsx("p",{className:"info-desc",children:i.short_description}),r.jsxs("div",{className:"info-meta",children:[r.jsxs("span",{children:[r.jsx(Te,{size:16})," ",i.category]}),r.jsxs("span",{children:[r.jsx(He,{size:16})," ",(a=i.latitude)==null?void 0:a.toFixed(2),", ",(f=i.longitude)==null?void 0:f.toFixed(2)]})]}),r.jsx(Fe,{to:`/places/${i.slug}`,className:"explore-btn",children:"Explore Destination"})]},i.id)})}),r.jsx("button",{className:`start-journey-btn ${n?"active":""}`,onClick:n?c:s,children:n?"STOP JOURNEY":"START JOURNEY"}),r.jsx("div",{className:"storytelling-text",children:"One country. Countless journeys."})]})}function at(){const[o,e]=l.useState([]),[t,i]=l.useState([]),[n,s]=l.useState([]),[c,a]=l.useState("ALL"),[f,u]=l.useState(null),[d,g]=l.useState(!1),[m,_]=l.useState(0),[M,L]=l.useState(null),E=window.matchMedia("(prefers-reduced-motion: reduce)").matches,h=l.useRef(null);l.useEffect(()=>{$.get("/api/journey/destinations/").then(y=>{var T;const j=((T=y.data)==null?void 0:T.data)||y.data||[];e(j),j.length>0&&u(j[0])}).catch(console.error),$.get("/api/journey/regions/").then(y=>{var j;return s(((j=y.data)==null?void 0:j.data)||y.data||[])}).catch(console.error),$.get("/api/journey/featured/").then(y=>{var j;return i(((j=y.data)==null?void 0:j.data)||y.data||[])}).catch(console.error),fetch("/india.json").then(y=>y.json()).then(y=>L(y)).catch(console.error)},[]);const v=l.useMemo(()=>c==="ALL"?o:o.filter(y=>y.region.toUpperCase()===c.toUpperCase()),[o,c]);l.useEffect(()=>{let y;return d&&t.length>0&&(u(t[m]),y=setInterval(()=>{_(j=>(j+1)%t.length)},5e3)),()=>clearInterval(y)},[d,m,t]),l.useEffect(()=>{d&&t.length>0&&u(t[m])},[m,d,t]);const p=()=>{g(!0),_(0),a("ALL")},x=()=>{g(!1)},_e=y=>{x(),u(y)},Le=({activeDest:y,isCinematic:j})=>(I(T=>{if(!h.current||!y||E)return;const k=N(y.latitude,y.longitude,0),V=new A(k[0],k[1],k[2]);if(h.current.target.lerp(V,.05),j){const je=new A(V.x,3,V.z+4);T.camera.position.lerp(je,.02)}h.current.update()}),null);return r.jsxs(ge.section,{className:"journey-section",initial:{opacity:0,y:50},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-100px"},transition:{duration:.8},children:[r.jsxs("div",{className:"journey-header",children:[r.jsx("h2",{className:"journey-title",children:"Journey Across India"}),r.jsx("p",{className:"journey-subtitle",children:"From the Himalayas to the Indian Ocean."})]}),r.jsxs("div",{className:"journey-container",children:[r.jsx("div",{className:"journey-map-container",children:r.jsxs(We,{camera:{position:[0,5,8],fov:45},children:[r.jsx("ambientLight",{intensity:.2}),r.jsx("directionalLight",{position:[10,10,5],intensity:1,color:"#cda87c"}),r.jsx(Ye,{ref:h,enableDamping:!0,dampingFactor:.05,minDistance:2,maxDistance:15,maxPolarAngle:Math.PI/2.2}),r.jsx(et,{mapData:M,reducedMotion:E}),r.jsx(nt,{destinations:v,activeDestination:f,onSelect:_e,reducedMotion:E}),r.jsx(it,{destinations:t,isCinematic:d,reducedMotion:E}),r.jsx(Le,{activeDest:f,isCinematic:d})]})}),r.jsx(st,{regions:n,activeRegion:c,setActiveRegion:a,activeDestination:f,isCinematic:d,startJourney:p,stopJourney:x})]})]})}export{at as JourneyAcrossIndia};
