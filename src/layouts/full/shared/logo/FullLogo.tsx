import OstikLogo from "../../../../assets/images/logos/OSTIK_PNG.png";

const FullLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <img
        src={OstikLogo}
        alt="Ostik"
        className="h-8 w-auto"
      />

      <span className="text-lg font-semibold text-foreground">
        Admin
      </span>
    </div>
  );
};

export default FullLogo;