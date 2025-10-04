export default function HorizontalVideoSection({children}) {
    return(
        <>
         <section className="container-fluid p-5 video-background-section">
            {/* Video Background */}
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="background-video"
                onEnded={(e) => {
                    e.target.playbackRate = -1;
                    e.target.play();
                }}
            >
                <source src="/videos/video.mp4" type="video/mp4" />
            </video>
        
            
            <div className="video-overlay"></div>
        
            <div className="row video-content-row">
                <div className="col-12 d-flex justify-content-center align-items-center">
                   {children}
                </div>
            </div>
        </section>
        </>
    )
}