"use client";
import Orb from "../components/orb";
import Navbar from "../components/navbar";

export default function Docs(){
    return(
        <div className="relative flex flex-col min-w-screen min-h-screen overflow-y-auto items-center gap-10 bg-black">
            
            <Navbar/>

            {/* Background Container */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Orb
                hoverIntensity={2.0}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
                />
            </div>

            {/* hero section */}
            <div id="hero-container" className="flex flex-col w-[85%] h-fit items-center gap-5 z-10 mt-20">
                <div className="flex flex-col items-center gap-5 p-5 text-white">
                    <h1 className="text-6xl font-bold font-archivo">Documentation</h1>
                </div>

                <div className="w-full h-fit text-white font-archivo bg-white/10 backdrop-blur-md px-5 py-2 rounded-2xl">
                    <h2 className="text-4xl font-semibold">Model: YOLO11s</h2>
                    <p className="font-light text-[15px]">
                        We use YOLO11s which has more parameters compared to YOLO11n. 
                        <br />
                        The model is trained for 14 hours using RTX 3050 4GB VRAM. The model achieves 88.4% accuracy in distinguishing the type of the tumor labelling the boundary box.</p>
                </div>

                <div className="w-full h-fit grid grid-cols-3 gap-2 text-white font-archivo text-center">
                    <div className="bg-white/10 backdrop-blur-md flex flex-col rounded-2xl gap-2 px-4 py-2">
                        <h2 className="font-bold text-4xl">BiFPN</h2>
                        <p className="text-start">
                            Bidirectional Feature Pyramid Network.
                            <br />
                            YOLO passes information in single direction Top to bottom.
                            With BiFPN, the model can now it can capture semantic and details. 
                            With this, the model can also capture tiny Pituitary tumor. 
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md flex flex-col rounded-2xl gap-2 px-4 py-2">
                        <h2 className="font-bold text-4xl">SPPF</h2>
                        <p className="text-start">
                            Spatial Pyramid Pooling Fast. 
                            <br />
                            SPPF helps the model understand overal shape of the brain. 
                            It makes the model does not go way pass the skull area.
                           
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md flex flex-col rounded-2xl gap-2 px-4 py-2">
                        <h2 className="font-bold text-4xl">CBAM</h2>
                        <p className="text-start">
                            Convolutional Block Attention Module.
                            <br />
                            We inserted CBAM at layer 20. It acts like highlighter for the AI.
                            Channel Attention distinguishes tumor tissue vs Grey matter. 
                            Spatial Attention focusses on the tumor area and ignores the skull and eyes.

                        </p>
                    </div>
                </div>
            </div>


            {/* Results */}
            <div className="w-[85%] bg-white/10 backdrop-blur-md py-2 px-12 flex flex-col items-center justify-center gap-2 rounded-4xl">
                <h2 className="font-archivo font-bold text-4xl text-white">Training Results</h2>
                <div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full">
                        <img src="/results.png" alt="training results" className="rounded-2xl"/>
                    </div>
                </div>
            </div>

            {/* confusion matrix */}
            <div className="w-[85%] bg-white/10 backdrop-blur-md pt-2 pb-12 px-12 flex flex-col items-center justify-center gap-2 rounded-4xl">
                <h2 className="font-archivo font-bold text-4xl text-white">Confusion Matrix</h2>
                <div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full">
                        <img src="/confusion_matrix.png" alt="training results" className="rounded-2xl"/>
                    </div>
                </div>
                
            </div>


            {/* Precision and Confidence Curve */}
            <div className="w-[85%] bg-white/10 backdrop-blur-md py-2 px-12 flex flex-col items-center justify-center gap-2 rounded-4xl">
                <h2 className="font-archivo font-bold text-4xl text-white">Precision and Confidence Curve</h2>
                <div className="w-full grid grid-cols-2 gap-2 items-center justify-center">
                    <div>
                        <img src="/BoxF1_curve.png" alt="F1" className="rounded-2xl"/> 
                    </div>
                    <div>
                        <img src="/BoxP_curve.png" alt="Precision" className="rounded-2xl"/> 
                    </div>
                    <div>
                        <img src="/BoxPR_curve.png" alt="Precision-Recall"className="rounded-2xl" /> 
                    </div>
                    <div>
                        <img src="/BoxR_curve.png" alt="Recall" className="rounded-2xl"/> 
                    </div>
                </div>
            </div>
            
        </div>
    );
}