const HeaderBox: React.FC<HeaderBoxProps> = ({
   title,
   type,
   subtext,
   user,
}) => {
   return (
      <div className="header-box">
         <h1 className="header-box-title">
            {title}{" "}
            {type === "greeting" && (
               <span className="text-bankGradient">&nbsp;{user}</span>
            )}
         </h1>
         <p className="hearder-box-subtext">{subtext}</p>
      </div>
   );
};

export default HeaderBox;
