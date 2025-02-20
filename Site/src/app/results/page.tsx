"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Results() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    interface Result {
        diagnosis: string;
        confidence: string;
        recommendations: string[];
    }

    const [result, setResult] = useState<Result | null>(null);

    useEffect(() => {
        // Simulate fetching results
        setTimeout(() => {
            const diagnoses = ["Healthy", "Low Dysarthria", "Mild Dysarthria", "High Dysarthria"];
            const randomDiagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
            const randomConfidence = `${Math.floor(Math.random() * 21) + 80}%`; // Random confidence between 80% and 100%

            setResult({
                diagnosis: randomDiagnosis,
                confidence: randomConfidence,
                recommendations: [
                    "Consult a speech therapist for a detailed assessment.",
                    "Practice slow and clear speech exercises.",
                    "Monitor speech patterns over time for changes."
                ]
            });
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold mb-6" data-aos="fade-up">Analysis Results</h1>
            {loading ? (
                <p className="text-lg" data-aos="fade-up">Processing your speech sample...</p>
            ) : (
                <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-xl text-center" data-aos="fade-up">
                    {result && (
                        <>
                            <h2 className="text-2xl font-semibold mb-4">Diagnosis: {result.diagnosis}</h2>
                            <p className="text-lg mb-4">Confidence Level: {result.confidence}</p>
                            <h3 className="text-xl font-semibold mb-2">Recommendations:</h3>
                            <ul className="list-disc list-inside text-lg mb-6">
                                {result.recommendations.map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </>
                    )}
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-blue-800 rounded-lg text-lg hover:bg-blue-900 transition"
                    >
                        Back to Home
                    </button>
                </div>
            )}
        </div>
    );
}
