import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ExploreAllTests() {
    const { t } = useTranslation("common");

    return (
        <div className="text-center mt-10 mb-12">
            <Link
                to="/"
                className="inline-block px-6 py-2 text-sm font-semibold rounded-full bg-black text-white hover:bg-gray-800 transition"
            >
                {t("exploreAll.button")}
            </Link>
        </div>
    );
}
