import React, { useEffect, useState } from 'react';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        async function loadPosts() {
            const response = await fetch('https://kyle.epizy.com/wordpress/wp-json/wp/v2/posts', { mode: 'no-cors' });
            if (!response.ok) {
                // oups! something went wrong
                return;
            }

            const posts = await response.json();
            setPosts(posts);
        }

        loadPosts();


    }, [])
    return (
        <section className="wordPressFeed">
            <div className="wrapper">
                {posts.map((post, index) => (
                    <div key={index}>

                        <blogPost
                            gutterBottom
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        <blogPost
                            component="content"
                            dangerouslySetInnerHTML={{ __html: post.content.rendered }} />


                    </div>
                ))}
            </div>
        </section>
    );
}