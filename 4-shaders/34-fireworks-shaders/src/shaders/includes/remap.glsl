float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax) {
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

float remapClamp(float value, float originMin, float originMax, float destinationMin, float destinationMax) {
    return clamp(remap(value, originMin, originMax, destinationMin, destinationMax), destinationMin, destinationMax);
}