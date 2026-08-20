import{R as we,I as Ne,F as ue,a as Z,b as D,W as Re,B as ne,S as Ee,V as A,c as Ae,U as ee,d as pe,e as ie,M as De,f as N,L as Te,g as We,h as se,r as l,u as P,C as oe,_ as q,i as ke,j as T,k as He,l as Fe,m as r,n as Ge,A as Ve,o as _e,p as $e,q as Je,s as qe,t as Y}from"./index-D_AH9-kj.js";import{H as Ye}from"./Html-D0AnXaxn.js";const je=parseInt(we.replace(/\D+/g,"")),Le=je>=125?"uv1":"uv2",me=new ne,V=new A;class re extends Ne{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],o=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(o),this.setAttribute("position",new ue(e,3)),this.setAttribute("uv",new ue(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,o=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),o.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const o=new Z(t,6,1);return this.setAttribute("instanceStart",new D(o,3,0)),this.setAttribute("instanceEnd",new D(o,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let o;e instanceof Float32Array?o=e:Array.isArray(e)&&(o=new Float32Array(e));const n=new Z(o,t*2,1);return this.setAttribute("instanceColorStart",new D(n,t,0)),this.setAttribute("instanceColorEnd",new D(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Re(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ne);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),me.setFromBufferAttribute(t),this.boundingBox.union(me))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ee),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const o=this.boundingSphere.center;this.boundingBox.getCenter(o);let n=0;for(let s=0,a=e.count;s<a;s++)V.fromBufferAttribute(e,s),n=Math.max(n,o.distanceToSquared(V)),V.fromBufferAttribute(t,s),n=Math.max(n,o.distanceToSquared(V));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class Me extends re{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,o=new Float32Array(2*t);for(let n=0;n<t;n+=3)o[2*n]=e[n],o[2*n+1]=e[n+1],o[2*n+2]=e[n+2],o[2*n+3]=e[n+3],o[2*n+4]=e[n+4],o[2*n+5]=e[n+5];return super.setPositions(o),this}setColors(e,t=3){const o=e.length-t,n=new Float32Array(2*o);if(t===3)for(let s=0;s<o;s+=t)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];else for(let s=0;s<o;s+=t)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5],n[2*s+6]=e[s+6],n[2*s+7]=e[s+7];return super.setColors(n,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class ae extends Ae{constructor(e){super({type:"LineMaterial",uniforms:ee.clone(ee.merge([pe.common,pe.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ie(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${je>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const K=new N,he=new A,ge=new A,S=new N,b=new N,C=new N,X=new A,Q=new We,w=new Te,ve=new A,$=new ne,J=new Ee,U=new N;let O,B;function ye(i,e,t){return U.set(0,0,-e,1).applyMatrix4(i.projectionMatrix),U.multiplyScalar(1/U.w),U.x=B/t.width,U.y=B/t.height,U.applyMatrix4(i.projectionMatrixInverse),U.multiplyScalar(1/U.w),Math.abs(Math.max(U.x,U.y))}function Ke(i,e){const t=i.matrixWorld,o=i.geometry,n=o.attributes.instanceStart,s=o.attributes.instanceEnd,a=Math.min(o.instanceCount,n.count);for(let c=0,d=a;c<d;c++){w.start.fromBufferAttribute(n,c),w.end.fromBufferAttribute(s,c),w.applyMatrix4(t);const p=new A,f=new A;O.distanceSqToSegment(w.start,w.end,f,p),f.distanceTo(p)<B*.5&&e.push({point:f,pointOnLine:p,distance:O.origin.distanceTo(f),object:i,face:null,faceIndex:c,uv:null,[Le]:null})}}function Xe(i,e,t){const o=e.projectionMatrix,s=i.material.resolution,a=i.matrixWorld,c=i.geometry,d=c.attributes.instanceStart,p=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),g=-e.near;O.at(1,C),C.w=1,C.applyMatrix4(e.matrixWorldInverse),C.applyMatrix4(o),C.multiplyScalar(1/C.w),C.x*=s.x/2,C.y*=s.y/2,C.z=0,X.copy(C),Q.multiplyMatrices(e.matrixWorldInverse,a);for(let m=0,_=f;m<_;m++){if(S.fromBufferAttribute(d,m),b.fromBufferAttribute(p,m),S.w=1,b.w=1,S.applyMatrix4(Q),b.applyMatrix4(Q),S.z>g&&b.z>g)continue;if(S.z>g){const u=S.z-b.z,x=(S.z-g)/u;S.lerp(b,x)}else if(b.z>g){const u=b.z-S.z,x=(b.z-g)/u;b.lerp(S,x)}S.applyMatrix4(o),b.applyMatrix4(o),S.multiplyScalar(1/S.w),b.multiplyScalar(1/b.w),S.x*=s.x/2,S.y*=s.y/2,b.x*=s.x/2,b.y*=s.y/2,w.start.copy(S),w.start.z=0,w.end.copy(b),w.end.z=0;const j=w.closestPointToPointParameter(X,!0);w.at(j,ve);const E=se.lerp(S.z,b.z,j),h=E>=-1&&E<=1,v=X.distanceTo(ve)<B*.5;if(h&&v){w.start.fromBufferAttribute(d,m),w.end.fromBufferAttribute(p,m),w.start.applyMatrix4(a),w.end.applyMatrix4(a);const u=new A,x=new A;O.distanceSqToSegment(w.start,w.end,x,u),t.push({point:x,pointOnLine:u,distance:O.origin.distanceTo(x),object:i,face:null,faceIndex:m,uv:null,[Le]:null})}}}class Ce extends De{constructor(e=new re,t=new ae({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,o=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let a=0,c=0,d=t.count;a<d;a++,c+=2)he.fromBufferAttribute(t,a),ge.fromBufferAttribute(o,a),n[c]=c===0?0:n[c-1],n[c+1]=n[c]+he.distanceTo(ge);const s=new Z(n,2,1);return e.setAttribute("instanceDistanceStart",new D(s,1,0)),e.setAttribute("instanceDistanceEnd",new D(s,1,1)),this}raycast(e,t){const o=this.material.worldUnits,n=e.camera;n===null&&!o&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const s=e.params.Line2!==void 0&&e.params.Line2.threshold||0;O=e.ray;const a=this.matrixWorld,c=this.geometry,d=this.material;B=d.linewidth+s,c.boundingSphere===null&&c.computeBoundingSphere(),J.copy(c.boundingSphere).applyMatrix4(a);let p;if(o)p=B*.5;else{const g=Math.max(n.near,J.distanceToPoint(O.origin));p=ye(n,g,d.resolution)}if(J.radius+=p,O.intersectsSphere(J)===!1)return;c.boundingBox===null&&c.computeBoundingBox(),$.copy(c.boundingBox).applyMatrix4(a);let f;if(o)f=B*.5;else{const g=Math.max(n.near,$.distanceToPoint(O.origin));f=ye(n,g,d.resolution)}$.expandByScalar(f),O.intersectsBox($)!==!1&&(o?Ke(this,t):Xe(this,n,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(K),this.material.uniforms.resolution.value.set(K.z,K.w))}}class Qe extends Ce{constructor(e=new Me,t=new ae({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const te=l.forwardRef(function({points:e,color:t=16777215,vertexColors:o,linewidth:n,lineWidth:s,segments:a,dashed:c,...d},p){var f,g;const m=P(h=>h.size),_=l.useMemo(()=>a?new Ce:new Qe,[a]),[L]=l.useState(()=>new ae),j=(o==null||(f=o[0])==null?void 0:f.length)===4?4:3,E=l.useMemo(()=>{const h=a?new re:new Me,v=e.map(u=>{const x=Array.isArray(u);return u instanceof A||u instanceof N?[u.x,u.y,u.z]:u instanceof ie?[u.x,u.y,0]:x&&u.length===3?[u[0],u[1],u[2]]:x&&u.length===2?[u[0],u[1],0]:u});if(h.setPositions(v.flat()),o){t=16777215;const u=o.map(x=>x instanceof oe?x.toArray():x);h.setColors(u.flat(),j)}return h},[e,a,o,j]);return l.useLayoutEffect(()=>{_.computeLineDistances()},[e,_]),l.useLayoutEffect(()=>{c?L.defines.USE_DASH="":delete L.defines.USE_DASH,L.needsUpdate=!0},[c,L]),l.useEffect(()=>()=>E.dispose(),[E]),l.createElement("primitive",q({object:_,ref:p},d),l.createElement("primitive",{object:E,attach:"geometry"}),l.createElement("primitive",q({object:L,attach:"material",color:t,vertexColors:!!o,resolution:[m.width,m.height],linewidth:(g=n??s)!==null&&g!==void 0?g:1,dashed:c,transparent:j===4},d)))});function Ze(i,e,t,o){const n=class extends Ae{constructor(a={}){const c=Object.entries(i);super({uniforms:c.reduce((d,[p,f])=>{const g=ee.clone({[p]:{value:f}});return{...d,...g}},{}),vertexShader:e,fragmentShader:t}),this.key="",c.forEach(([d])=>Object.defineProperty(this,d,{get:()=>this.uniforms[d].value,set:p=>this.uniforms[d].value=p})),Object.assign(this,a)}};return n.key=se.generateUUID(),n}const et=()=>parseInt(we.replace(/\D+/g,"")),tt=et(),nt=l.forwardRef((i={enableDamping:!0},e)=>{const{domElement:t,camera:o,makeDefault:n,onChange:s,onStart:a,onEnd:c,...d}=i,p=P(v=>v.invalidate),f=P(v=>v.camera),g=P(v=>v.gl),m=P(v=>v.events),_=P(v=>v.set),L=P(v=>v.get),j=t||m.connected||g.domElement,E=o||f,h=l.useMemo(()=>new ke(E),[E]);return l.useEffect(()=>{h.connect(j);const v=u=>{p(),s&&s(u)};return h.addEventListener("change",v),a&&h.addEventListener("start",a),c&&h.addEventListener("end",c),()=>{h.dispose(),h.removeEventListener("change",v),a&&h.removeEventListener("start",a),c&&h.removeEventListener("end",c)}},[s,a,c,h,p,j]),l.useEffect(()=>{if(n){const v=L().controls;return _({controls:h}),()=>_({controls:v})}},[n,h]),T(()=>h.update(),-1),l.createElement("primitive",q({ref:e,object:h,enableDamping:!0},d))}),it=Ze({time:0,pixelRatio:1},` uniform float pixelRatio;
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
      #include <${tt>=154?"colorspace_fragment":"encodings_fragment"}>
    }`),Ue=i=>i&&i.constructor===Float32Array,st=i=>[i.r,i.g,i.b],Oe=i=>i instanceof ie||i instanceof A||i instanceof N,ze=i=>Array.isArray(i)?i:Oe(i)?i.toArray():[i,i,i];function W(i,e,t){return l.useMemo(()=>{if(e!==void 0){if(Ue(e))return e;if(e instanceof oe){const o=Array.from({length:i*3},()=>st(e)).flat();return Float32Array.from(o)}else if(Oe(e)||Array.isArray(e)){const o=Array.from({length:i*3},()=>ze(e)).flat();return Float32Array.from(o)}return Float32Array.from({length:i},()=>e)}return Float32Array.from({length:i},t)},[e])}const ot=l.forwardRef(({noise:i=1,count:e=100,speed:t=1,opacity:o=1,scale:n=1,size:s,color:a,children:c,...d},p)=>{l.useMemo(()=>He({SparklesImplMaterial:it}),[]);const f=l.useRef(null),g=P(u=>u.viewport.dpr),m=ze(n),_=l.useMemo(()=>Float32Array.from(Array.from({length:e},()=>m.map(se.randFloatSpread)).flat()),[e,...m]),L=W(e,s,Math.random),j=W(e,o),E=W(e,t),h=W(e*3,i),v=W(a===void 0?e*3:e,Ue(a)?a:new oe(a),()=>1);return T(u=>{f.current&&f.current.material&&(f.current.material.time=u.clock.elapsedTime)}),l.useImperativeHandle(p,()=>f.current,[]),l.createElement("points",q({key:`particle-${e}-${JSON.stringify(n)}`},d,{ref:f}),l.createElement("bufferGeometry",null,l.createElement("bufferAttribute",{attach:"attributes-position",args:[_,3]}),l.createElement("bufferAttribute",{attach:"attributes-size",args:[L,1]}),l.createElement("bufferAttribute",{attach:"attributes-opacity",args:[j,1]}),l.createElement("bufferAttribute",{attach:"attributes-speed",args:[E,1]}),l.createElement("bufferAttribute",{attach:"attributes-color",args:[v,3]}),l.createElement("bufferAttribute",{attach:"attributes-noise",args:[h,3]})),c||l.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:g,depthWrite:!1}))}),xe={lat:22.5,lng:82.5},Se=.65;function k(i,e,t=0){const o=i-xe.lat,s=(e-xe.lng)*Se,a=-o*Se;return[s,t,a]}function rt(i,e=0){const t=[];if(!i||!i.geometry)return t;const o=i.geometry.type,n=i.geometry.coordinates;return o==="Polygon"?n.forEach(s=>{const a=s.map(c=>k(c[1],c[0],e));t.push(a)}):o==="MultiPolygon"&&n.forEach(s=>{s.forEach(a=>{const c=a.map(d=>k(d[1],d[0],e));t.push(c)})}),t}function at({mapData:i,reducedMotion:e}){const t=l.useMemo(()=>i?rt(i,0):[],[i]),o=Fe.useRef();return T(n=>{if(!e&&o.current){const s=n.clock.getElapsedTime();o.current.position.y=Math.sin(s*.4)*.12-.3}}),t.length===0?null:r.jsxs("group",{ref:o,children:[t.map((n,s)=>r.jsx(te,{points:n,color:"#cda87c",lineWidth:1.8,transparent:!0,opacity:.75},s)),t.map((n,s)=>r.jsx(te,{points:n,color:"#cda87c",lineWidth:4,transparent:!0,opacity:.08},`g${s}`)),r.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.1,0],children:[r.jsx("planeGeometry",{args:[120,120]}),r.jsx("meshBasicMaterial",{color:"#050508",transparent:!0,opacity:.85})]}),!e&&r.jsx(ot,{count:80,scale:[22,3,22],size:1.5,speed:.15,opacity:.25,color:"#cda87c",position:[0,.5,0]})]})}function ct({destination:i,isActive:e,onClick:t,reducedMotion:o}){const[n,s]=l.useState(!1),a=k(i.latitude,i.longitude,0),c=l.useRef(),d=l.useRef();T((f,g)=>{if(!o){if(e&&d.current){d.current.rotation.x+=g,d.current.rotation.y+=g*.5;const m=1+Math.sin(f.clock.elapsedTime*3)*.2;d.current.scale.set(m,m,m)}if(c.current){const m=e||n?1.5:1;c.current.scale.lerp(new A(m,m,m),.1)}}});const p=e?"#ffffff":"#cda87c";return r.jsxs("group",{position:a,onClick:f=>{f.stopPropagation(),t()},onPointerOver:()=>s(!0),onPointerOut:()=>s(!1),children:[r.jsxs("mesh",{ref:c,children:[r.jsx("sphereGeometry",{args:[.15,16,16]}),r.jsx("meshBasicMaterial",{color:p})]}),e&&r.jsxs("mesh",{ref:d,children:[r.jsx("torusGeometry",{args:[.3,.05,8,24]}),r.jsx("meshBasicMaterial",{color:"#ffffff",transparent:!0,opacity:.8})]}),r.jsx(Ye,{distanceFactor:15,center:!0,position:[0,.5,0],style:{pointerEvents:"none"},children:r.jsx("div",{style:{color:e?"#fff":"rgba(255,255,255,0.7)",fontWeight:e?"700":"400",fontSize:"14px",textShadow:"0 2px 4px rgba(0,0,0,0.8)",whiteSpace:"nowrap",transform:e?"scale(1.1)":"scale(1)",transition:"transform 0.3s ease, opacity 0.3s ease",opacity:e||n?1:0},children:i.destination})})]})}function lt({destinations:i,activeDestination:e,onSelect:t,reducedMotion:o}){return i?r.jsx("group",{children:Array.isArray(i)&&i.map(n=>r.jsx(ct,{destination:n,isActive:e&&e.id===n.id,onClick:()=>t(n),reducedMotion:o},n.id))}):null}function dt({destinations:i,activeIndex:e,isCinematic:t,reducedMotion:o}){const n=l.useMemo(()=>{if(!Array.isArray(i)||i.length<2)return null;const d=i.map(p=>{const f=k(p.latitude,p.longitude,0);return new A(...f)});return new Ge(d,!1,"catmullrom",.5)},[i]),s=l.useRef(0),a=l.useRef();if(T((d,p)=>{if(t&&!o&&n&&a.current){s.current=d.clock.elapsedTime*.1%1;const f=n.getPoint(s.current);a.current.position.copy(f)}}),!n||!t)return null;const c=n.getPoints(50);return r.jsxs("group",{children:[r.jsx(te,{points:c,color:"#cda87c",lineWidth:2,transparent:!0,opacity:.3,dashed:!0,dashSize:.5,dashScale:1,dashOffset:0}),!o&&r.jsxs("mesh",{ref:a,children:[r.jsx("sphereGeometry",{args:[.08,16,16]}),r.jsx("meshBasicMaterial",{color:"#ffffff"}),r.jsx("pointLight",{color:"#ffffff",intensity:2,distance:2})]})]})}const ft=i=>i?i.startsWith("http")?i:`http://127.0.0.1:8000${i}`:null,be="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600";function ut({activeDestination:i,loading:e,error:t,onRetry:o}){return r.jsx("div",{className:"journey-info-panel",children:r.jsx("div",{className:"info-card",children:e?r.jsxs("div",{className:"info-loading-state",children:[r.jsx("div",{className:"skeleton skeleton-image"}),r.jsxs("div",{style:{padding:"0 24px 24px"},children:[r.jsx("div",{className:"skeleton skeleton-title"}),r.jsx("div",{className:"skeleton skeleton-text",style:{marginTop:8}}),r.jsx("div",{className:"skeleton skeleton-text",style:{marginTop:8}})]})]}):t?r.jsxs("div",{className:"info-error-state",children:[r.jsx("h3",{children:"Unable to load destinations."}),r.jsx("button",{className:"explore-btn",onClick:o,style:{maxWidth:180},children:"Retry"})]}):i?r.jsx(Ve,{mode:"wait",children:r.jsxs(_e.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.5,ease:"easeInOut"},className:"info-card-inner",children:[r.jsxs("div",{className:"info-image-container",children:[r.jsx("img",{src:ft(i.image)||be,alt:`${i.destination}, ${i.state}`,className:"info-image",loading:"lazy",onError:n=>{n.currentTarget.src=be}}),r.jsx("div",{className:"info-image-overlay"})]}),r.jsxs("div",{className:"info-content-container",children:[r.jsxs("h3",{className:"info-title",children:[r.jsx($e,{size:20,color:"#cda87c","aria-hidden":"true"}),i.destination]}),r.jsxs("span",{className:"info-state",children:[i.state," • ",i.region]}),r.jsx("p",{className:"info-desc",children:i.short_description}),r.jsx(Je,{to:`/places/${i.slug}`,className:"explore-btn","aria-label":`Explore ${i.destination}`,children:"Explore Destination →"})]})]},i.id)}):r.jsx("div",{className:"info-empty-state",children:r.jsx("h3",{children:"No destinations available for this region."})})})})}function gt(){const[i,e]=l.useState([]),[t,o]=l.useState([]),[n,s]=l.useState([]),[a,c]=l.useState("ALL"),[d,p]=l.useState(null),[f,g]=l.useState(!1),[m,_]=l.useState(0),[L,j]=l.useState(null),E=window.matchMedia("(prefers-reduced-motion: reduce)").matches,h=l.useRef(null),[v,u]=l.useState(!0),[x,ce]=l.useState(null),le=()=>{u(!0),ce(null),Promise.all([Y.get("/journey/destinations/"),Y.get("/journey/regions/"),Y.get("/journey/featured/"),fetch("/india.json").then(y=>y.json())]).then(([y,R,M,z])=>{var G,de,fe;const I=((G=y.data)==null?void 0:G.data)||y.data||[];e(I),I.length>0&&p(I[0]),s(((de=R.data)==null?void 0:de.data)||R.data||[]),o(((fe=M.data)==null?void 0:fe.data)||M.data||[]),j(z),u(!1)}).catch(y=>{console.error(y),ce(!0),u(!1)})};l.useEffect(()=>{le()},[]);const H=l.useMemo(()=>a==="ALL"?i:i.filter(y=>y.region.toUpperCase()===a.toUpperCase()),[i,a]);l.useEffect(()=>{H.length>0?a==="ALL"||d&&d.region.toUpperCase()===a.toUpperCase()||p(H[0]):p(null)},[H,a]),l.useEffect(()=>{let y;if(f&&t.length>0){p(t[m]);const R=(m+1)%t.length,M=t[R];if(M&&M.image){const z=new window.Image;z.src=M.image.startsWith("http")?M.image:`http://127.0.0.1:8000${M.image}`}y=setInterval(()=>{_(z=>(z+1)%t.length)},5e3)}return()=>clearInterval(y)},[f,m,t]),l.useEffect(()=>{f&&t.length>0&&p(t[m])},[m,f,t]);const Pe=()=>{g(!0),_(0),c("ALL")},F=()=>{g(!1)},Ie=y=>{F(),p(y)},Be=({activeDest:y,isCinematic:R})=>(T(M=>{if(!h.current||!y||E)return;const z=k(y.latitude,y.longitude,0),I=new A(z[0],z[1],z[2]);if(h.current.target.lerp(I,.05),R){const G=new A(I.x,3,I.z+4);M.camera.position.lerp(G,.02)}h.current.update()}),null);return r.jsxs(_e.section,{className:"journey-section",initial:{opacity:0,y:50},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-100px"},transition:{duration:.8},children:[r.jsxs("div",{className:"journey-header",children:[r.jsx("h2",{className:"journey-title",children:"Journey Across India"}),r.jsx("p",{className:"journey-subtitle",children:"From the Himalayas to the Indian Ocean."})]}),r.jsxs("div",{className:"journey-filters",children:[r.jsx("button",{className:`filter-btn ${a==="ALL"?"active":""}`,onClick:()=>{c("ALL"),F()},"aria-label":"Show all regions",children:"ALL INDIA"}),Array.isArray(n)&&n.map(y=>r.jsx("button",{className:`filter-btn ${a===y.name?"active":""}`,onClick:()=>{c(y.name),F()},"aria-label":`Filter by ${y.name}`,children:y.name.toUpperCase()},y.id))]}),r.jsxs("div",{className:"journey-container",children:[r.jsx("div",{className:"journey-map-container",role:"region","aria-label":"Interactive India map",children:r.jsxs(qe,{camera:{position:[0,5,8],fov:45},children:[r.jsx("ambientLight",{intensity:.3}),r.jsx("directionalLight",{position:[10,10,5],intensity:1.2,color:"#cda87c"}),r.jsx("pointLight",{position:[-10,5,-5],intensity:.4,color:"#4080ff"}),r.jsx(nt,{ref:h,enableDamping:!0,dampingFactor:.05,minDistance:2,maxDistance:15,maxPolarAngle:Math.PI/2.2}),r.jsx(at,{mapData:L,reducedMotion:E}),r.jsx(lt,{destinations:H,activeDestination:d,onSelect:Ie,reducedMotion:E}),r.jsx(dt,{destinations:t,isCinematic:f,reducedMotion:E}),r.jsx(Be,{activeDest:d,isCinematic:f})]})}),r.jsx(ut,{activeDestination:d,loading:v,error:x,onRetry:le})]}),r.jsxs("div",{className:"journey-controls-row",children:[r.jsx("button",{className:`start-journey-btn ${f?"active":""}`,onClick:f?F:Pe,disabled:v||!!x||!d,"aria-label":f?"Stop journey":"Start journey across India",children:f?"■ STOP JOURNEY":"▶ START JOURNEY"}),r.jsx("span",{className:"storytelling-text",children:"One country. Countless journeys."})]})]})}export{gt as JourneyAcrossIndia};
