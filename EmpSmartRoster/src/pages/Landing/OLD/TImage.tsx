import "./TImage.css";

export default function TImage({
  className = "",
  attr1 = "/assets/image.png",
  text = "James ",
  text1 = "(F&B Business Owner)",
  text2 = '"EmpRoster has greatly simplified scheduling for my business, ensuring smoother shift management and reducing conflicts among staff"',
}: TImageProps) {
  return (
    <div
      className={`${className} t-image-t-image-14tjames-fbbusiness-owner-emproster-has-greatly-simplified-scheduling-for-my-business-ensuring-smoother-shift-management-and-reducing-conflicts-among-staff-1`}
    >
      <img className="t-image-image" src={attr1} loading="lazy" />
      <div className="t-image-t-james-fbbusiness-owner">
        <div className="t-image-james-fbbusiness-owner">
          <span className="t-image-main-text">
            <p className="t-image-para">{text}</p>
            <p>{text1}</p>
          </span>
        </div>
      </div>
      <div className="t-image-emproster-has-greatly-simplified-scheduling-for-my-business-ensuring-smoother-shift-management-and-reducing-conflicts-among-staff" >
        <p>{text2}</p>
      </div>
    </div>
  );
}

interface TImageProps {
  className?: string;
  attr1: string;
  text: string;
  text1: string;
  text2: string;
}
