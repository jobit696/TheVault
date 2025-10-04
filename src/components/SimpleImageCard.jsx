import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function SimpleImageCard({url}) {
    return(
        <div className="card custom-image-card" style={{width: '18rem'}}>
            <LazyLoadImage
                src={url}
                alt="Image"
                className="card-img"
                effect="blur"
                threshold={100}
                wrapperProps={{
                    style: {
                        width: '100%',
                        display: 'block'
                    }
                }}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
            />
        </div>
    )
}