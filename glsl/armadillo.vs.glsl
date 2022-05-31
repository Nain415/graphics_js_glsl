
uniform vec3 lightPosition;

uniform mat4 rotationMatrix;

out vec3 colour;

vec4 worldPos;

#define PELVIS_HEIGHT 25.0
#define GAP 7.5

void main() {
    // HINT: Q1(d and e) You will need to change worldPos to make the Armadillo move.

	vec4 worldPos = modelMatrix * vec4(position, 1.0);
	
	float alpha = (position.y - (PELVIS_HEIGHT - GAP)) / GAP;
	vec4 rotatedpoint = alpha * modelMatrix * rotationMatrix * vec4(position, 1.0);
	vec4 unrotatedpoint = (1.0 - alpha) * worldPos;
	
	if (position.y > PELVIS_HEIGHT) {
		worldPos = modelMatrix * rotationMatrix * vec4(position, 1.0);
	}
	
	if (position.y >= (PELVIS_HEIGHT - GAP)) {
		if (position.y <= PELVIS_HEIGHT) {
			worldPos = rotatedpoint + unrotatedpoint;
		}
	
	}
	
    vec3 vertexNormal = normalize(normalMatrix*normal);

    vec3 lightDirection = normalize(vec3(viewMatrix*(vec4(lightPosition - worldPos.xyz, 0.0))));

    float vertexColour = dot(lightDirection, vertexNormal);
    colour = vec3(vertexColour);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
    
}