export function shouldPlayAmbientVideo({
  inView,
  reducedMotion,
  saveData,
  hidden,
}: {
  inView: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  hidden: boolean;
}): boolean {
  return inView && !reducedMotion && !saveData && !hidden;
}
