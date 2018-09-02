float blink(float pos) {
  float blink = sin((pos / 0.2 - 10. * time)* 1.);
  return (blink > .9) ? 1. : .7;
}
