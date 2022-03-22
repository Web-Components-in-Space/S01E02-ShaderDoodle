interface Shader {
    id: number;
    isShaderToy?: boolean,
    name: string,
    fragment: string,
    vertex: string,
    texture?: string
}

export const DEFAULT_VERTEX = `attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

export const GRADIENT: Shader = {
    id: 0,
    name: 'Simple Gradient',
    fragment: `void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
    
    gl_FragColor = vec4(color, 1.0);
}`,
    vertex: DEFAULT_VERTEX
}

export const FRACTAL_PYRAMID: Shader = {
    id: 1,
    isShaderToy: true,
    name: 'Fractal Pyramid',
    fragment: `vec3 palette(float d){
	return mix(vec3(0.2,0.7,0.9),vec3(1.,0.,1.),d);
}

vec2 rotate(vec2 p,float a){
	float c = cos(a);
    float s = sin(a);
    return p*mat2(c,s,-s,c);
}

float map(vec3 p){
    for( int i = 0; i<8; ++i){
        float t = iTime*0.2;
        p.xz =rotate(p.xz,t);
        p.xy =rotate(p.xy,t*1.89);
        p.xz = abs(p.xz);
        p.xz-=.5;
	}
	return dot(sign(p),p)/5.;
}

vec4 rm (vec3 ro, vec3 rd){
    float t = 0.;
    vec3 col = vec3(0.);
    float d;
    for(float i =0.; i<64.; i++){
		vec3 p = ro + rd*t;
        d = map(p)*.5;
        if(d<0.02){
            break;
        }
        if(d>100.){
        	break;
        }
        //col+=vec3(0.6,0.8,0.8)/(400.*(d));
        col+=palette(length(p)*.1)/(400.*(d));
        t+=d;
    }
    return vec4(col,1./(d*100.));
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-(iResolution.xy/2.))/iResolution.x;
	vec3 ro = vec3(0.,0.,-50.);
    ro.xz = rotate(ro.xz,iTime);
    vec3 cf = normalize(-ro);
    vec3 cs = normalize(cross(cf,vec3(0.,1.,0.)));
    vec3 cu = normalize(cross(cf,cs));
    
    vec3 uuv = ro+cf*3. + uv.x*cs + uv.y*cu;
    
    vec3 rd = normalize(uuv-ro);
    
    vec4 col = rm(ro,rd);
    
    
    fragColor = col;
}

/** SHADERDATA
{
	"title": "fractal pyramid",
	"description": "",
	"model": "car"
}
*/`, vertex: DEFAULT_VERTEX
}

export const WAVYCAM: Shader = {
    id: 2,
    texture: 'My Webcam',
    name: 'Wavy Camera',
    fragment: `uniform sampler2D u_texture0;

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;

      // mirror uv for camera
      uv.x = (uv.x - 1.) * -1.;

      float distortion = sin(uv.y * 20. + u_time * 5.) * .02;

      float r = texture2D(u_texture0, uv).r;
      
      uv = vec2(uv.x + distortion, uv.y);
      vec2 gb = texture2D(u_texture0, uv).gb;

      gl_FragColor = vec4(r, gb, 1.);
    }`,
    vertex: DEFAULT_VERTEX
}

export const LAVA: Shader = {
    id: 3,
    isShaderToy: true,
    name: 'CineShader Lava',
    fragment: `float opSmoothUnion( float d1, float d2, float k )
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
} 

float map(vec3 p)
{
	float d = 2.0;
	for (int i = 0; i < 16; i++) {
		float fi = float(i);
		float time = iTime * (fract(fi * 412.531 + 0.513) - 0.5) * 2.0;
		d = opSmoothUnion(
            sdSphere(p + sin(time + fi * vec3(52.5126, 64.62744, 632.25)) * vec3(2.0, 2.0, 0.8), mix(0.5, 1.0, fract(fi * 412.531 + 0.5124))),
			d,
			0.4
		);
	}
	return d;
}

vec3 calcNormal( in vec3 p )
{
    const float h = 1e-5; // or some other value
    const vec2 k = vec2(1,-1);
    return normalize( k.xyy*map( p + k.xyy*h ) + 
                      k.yyx*map( p + k.yyx*h ) + 
                      k.yxy*map( p + k.yxy*h ) + 
                      k.xxx*map( p + k.xxx*h ) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    
    // screen size is 6m x 6m
	vec3 rayOri = vec3((uv - 0.5) * vec2(iResolution.x/iResolution.y, 1.0) * 6.0, 3.0);
	vec3 rayDir = vec3(0.0, 0.0, -1.0);
	
	float depth = 0.0;
	vec3 p;
	
	for(int i = 0; i < 64; i++) {
		p = rayOri + rayDir * depth;
		float dist = map(p);
        depth += dist;
		if (dist < 1e-6) {
			break;
		}
	}
	
    depth = min(6.0, depth);
	vec3 n = calcNormal(p);
    float b = max(0.0, dot(n, vec3(0.577)));
    vec3 col = (0.5 + 0.5 * cos((b + iTime * 3.0) + uv.xyx * 2.0 + vec3(0,2,4))) * (0.85 + b * 0.35);
    col *= exp( -depth * 0.15 );
	
    // maximum thickness is 2m in alpha channel
    fragColor = vec4(col, 1.0 - (depth - 0.5) / 2.0);
}

/** SHADERDATA
{
	"title": "My Shader 0",
	"description": "Lorem ipsum dolor",
	"model": "person"
}
*/`,
        vertex: DEFAULT_VERTEX
}

export const STARRY_FLARE: Shader = {
    id: 4,
    isShaderToy: true,
    name: 'Starry Flare',
    fragment: `
// http://www.pouet.net/prod.php?which=57245
// If you intend to reuse this shader, please add credits to 'Danilo Guanabara'

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
	vec3 c;
	float l,z=iTime;
	for(int i=0;i<3;i++) {
		vec2 uv,p=fragCoord.xy/iResolution.xy;
		uv=p;
		p-=.5;
		p.x*=iResolution.xy.x/iResolution.xy.y;
		z+=.07;
		l=length(p);
		uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
		c[i]=.01/length(mod(uv,1.)-.5);
	}
	fragColor=vec4(c/l,iTime);
}`,
    vertex: DEFAULT_VERTEX
}

export const SPIKYBLOB: Shader = {
    id: 5,
    isShaderToy: true,
    name: 'Spiky Purple Alien Blob',
    fragment: `
#define spikeNum 10.
#define radiusCircle 0.35

float smin( float a, float b, float k )
{
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*k*(1.0/4.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    vec3 col = vec3(1.);
    
    col+=(uv.y*0.5-0.5)*vec3(0.1,0.5,0.3); //bg
    
    float spikeSize = 0.025*abs(sin(iTime*1.5))+0.010; //15-35
    
    float thi = atan(uv.x, uv.y);
    float r = radiusCircle + (spikeSize) * sin(thi*spikeNum+iTime*10.);

    float circle = smoothstep(r, r+0.002, distance(uv, vec2(0.)));
    
    float violet = smoothstep(r+0.2, 0., distance(uv, vec2(0.)));
    vec3 violetcol = vec3(0.8, 0.4, 1.);
    
    float centercircle = smoothstep(r, 0.102, distance(uv, vec2(0.)));
    vec3 centercol = vec3(abs(sin(iTime)*0.7)+0.1, 0.8, 0.5);
    
    float origin = smoothstep(0.1, -0.1, distance(uv, vec2(0.)));
    vec3 origincol = vec3(0.8, 0.5, 0.);
    
    col *= circle + violet*violetcol + centercircle*centercol + origin*origincol;

    fragColor = vec4(col,1.0);
}`,
    vertex: DEFAULT_VERTEX
}

export const PINKU: Shader = {
    id: 6,
    isShaderToy: true,
    name: 'Pinku',
    fragment: `
float colormap_red(float x) {
    if (x < 0.0) {
        return 54.0 / 255.0;
    } else if (x < 20049.0 / 82979.0) {
        return (829.79 * x + 54.51) / 255.0;
    } else {
        return 1.0;
    }
}

float colormap_green(float x) {
    if (x < 20049.0 / 82979.0) {
        return 0.0;
    } else if (x < 327013.0 / 810990.0) {
        return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
    } else if (x <= 1.0) {
        return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
    } else {
        return 1.0;
    }
}

float colormap_blue(float x) {
    if (x < 0.0) {
        return 54.0 / 255.0;
    } else if (x < 7249.0 / 82979.0) {
        return (829.79 * x + 54.51) / 255.0;
    } else if (x < 20049.0 / 82979.0) {
        return 127.0 / 255.0;
    } else if (x < 327013.0 / 810990.0) {
        return (792.02249341361393720147485376583 * x - 64.364790735602331034989206222672) / 255.0;
    } else {
        return 1.0;
    }
}

vec4 colormap(float x) {
    return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);
}


float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

float fbm( vec2 p )
{
    float f = 0.0;

    f += 0.500000*noise( p + iTime  ); p = mtx*p*2.02;
    f += 0.031250*noise( p ); p = mtx*p*2.01;
    f += 0.250000*noise( p ); p = mtx*p*2.03;
    f += 0.125000*noise( p ); p = mtx*p*2.01;
    f += 0.062500*noise( p ); p = mtx*p*2.04;
    f += 0.015625*noise( p + sin(iTime) );

    return f/0.96875;
}

float pattern( in vec2 p )
{
	return fbm( p + fbm( p + fbm( p ) ) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.x;
	float shade = pattern(uv);
    fragColor = vec4(colormap(shade).rgb, shade);
}

/** SHADERDATA
{
	"title": "My Shader 0",
	"description": "Lorem ipsum dolor",
	"model": "person"
}
*/`,
    vertex: DEFAULT_VERTEX
}

export const WARPSPEED: Shader = {
    id: 7,
    isShaderToy: true,
    name: 'Warp Speed',
    fragment: `
// 'Warp Speed' by David Hoskins 2013.
// I tried to find gaps and variation in the star cloud for a feeling of structure.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = (iTime+29.) * 60.0;

    float s = 0.0, v = 0.0;
    vec2 uv = (-iResolution.xy + 2.0 * fragCoord ) / iResolution.y;
	float t = time*0.005;
	uv.x += sin(t) * 0.5;
	float si = sin(t + 2.17); // ...Squiffy rotation matrix!
	float co = cos(t);
	uv *= mat2(co, si, -si, co);
	vec3 col = vec3(0.0);
	vec3 init = vec3(0.25, 0.25 + sin(time * 0.001) * 0.4, floor(time) * 0.0008);
	for (int r = 0; r < 100; r++) 
	{
		vec3 p = init + s * vec3(uv, 0.143);
		p.z = mod(p.z, 2.0);
		for (int i=0; i < 10; i++)	p = abs(p * 2.04) / dot(p, p) - 0.75;
		v += length(p * p) * smoothstep(0.0, 0.5, 0.9 - s) * .002;
		// Get a purple and cyan effect by biasing the RGB in different ways...
		col +=  vec3(v * 0.8, 1.1 - s * 0.5, .7 + v * 0.5) * v * 0.013;
		s += .01;
	}
	fragColor = vec4(col, 1.0);
}
 
`,
    vertex: DEFAULT_VERTEX
}


export const shaders = [
    GRADIENT,
    WAVYCAM,
    LAVA,
    STARRY_FLARE,
    SPIKYBLOB,
    PINKU,
    WARPSPEED,
    FRACTAL_PYRAMID ];
