vec3 pointLight(vec3 color, float intensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 objectPosition, float lightDecay) {
    vec3 lightDistance = lightPosition - objectPosition;
    vec3 lightDirection = normalize(lightDistance);
    vec3 lightReflection = reflect(-lightDirection, normal);

    // Shading
    float shading = dot(normal, lightDirection);
    shading = max(shading, 0.0);

    // Specular
    float specular = -dot(lightReflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, specularPower);

    // Decay
    float distance = length(lightDistance);
    float decay = 1.0 / distance * lightDecay;
    decay = max(decay, 0.0);

    return color * intensity * decay * (shading + specular);
}