
import noprofile from "../../assets/default.png";

export default function Avatar({ src, size, radius, profile }) {
    const style = {
        height: size ? `${size}px` : "40px",
        width: size ? `${size}px` : "40px",
        borderRadius: radius || "50%",
        overflow: "hidden",
    };

    // Use profile directly (S3 URL) with fallback to src or noprofile
    const imageUrl = profile || src || noprofile;

    return (
        <div className="avatar" style={style}>
            <img
                src={imageUrl}
                alt="avatar"
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                onError={(e) => {
                    e.target.src = noprofile; // Fallback if S3 URL fails
                }}
            />
        </div>
    );
}