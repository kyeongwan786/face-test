import React, { useState } from "react";
import ResultSection from "./ResultSection";

export default function UploadSection({ gender }) {
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="text-center mt-4">
            <input type="file" accept="image/*" onChange={handleChange} />
            {image && (
                <>
                    <img
                        src={image}
                        alt="preview"
                        className="w-48 h-48 rounded-full mx-auto mt-4 shadow"
                    />
                    <ResultSection image={image} gender={gender} />
                </>
            )}
        </div>
    );
}
