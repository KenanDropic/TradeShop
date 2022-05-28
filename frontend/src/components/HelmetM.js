import { Helmet } from "react-helmet";

const HelmetM = ({ title, desc, kyw }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={kyw} />
    </Helmet>
  );
};

HelmetM.defaultProps = {
  title: "TradeShop",
  desc: "Best offers",
  kyw: "cheap,quality,offers",
};

export default HelmetM;
