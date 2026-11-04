type BrandLoaderProps = {
  label: string;
};

export function BrandLoader({ label }: BrandLoaderProps) {
  return (
    <div className="brand-loader" role="status" aria-live="polite" aria-atomic="true">
      <img
        className="brand-loader-logo"
        src="/branding/cestudy-master-logo-transparent.svg"
        alt=""
        aria-hidden="true"
        width={72}
        height={72}
      />
      <span>{label}</span>
    </div>
  );
}
