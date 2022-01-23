import React, { useEffect, useState } from 'react';

export default function Vinyls() {
    const [vinyls, setVinyls] = useState([]);
    useEffect(() => {
        async function loadVinyls() {
            const response = await fetch('https://kyle.resknow.co/wp-json/wp/v2/vinyls?_embed');
            if (!response.ok) {
                // oups! something went wrong
                return;
            }

            const vinyls = await response.json();
            setVinyls(vinyls);
        }

        loadVinyls();
    }, [])
    return (

        <section className='blogfeed'>

            <h1>My Favourite Vinyl Albums</h1>
            {vinyls.slice(0, 3).map((vinyl, index) => (
                <div key={index}>
                    <article>
                        <img alt="" src={vinyl._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url} />
                        <h2>Artist: {vinyl.acf.artist}</h2>
                        <p> Album Title: {vinyl.acf.album} </p>
                        <p> Year of Release: {vinyl.acf.year} </p>
                    </article>
                </div>
            ))}
        </section>

    );
}

