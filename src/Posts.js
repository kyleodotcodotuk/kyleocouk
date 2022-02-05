import React, { useEffect, useState } from 'react';
import category from './icons/category.svg';
// import author from './icons/author.svg';
import calendar from './icons/calendar.svg';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        async function loadPosts() {
            const response = await fetch('https://kyle.resknow.co/wp-json/wp/v2/posts?_embed');
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
        <section className='blogfeed'>

            <h2>Read Between the Designs</h2>
            {posts.slice(0, 3).map((post, index) => (
                <article className="blogposts" key={index}>

                    <div className="blogtitle" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

                    {/* <h4><img className='author' alt="" src={author} /><a href={post._embedded['author'].name}> {post._embedded['author'][0].name}</a></h4> */}
                    <div className="blogcontent" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

                    <img loading='lazy' className='ass-img' alt={post.title.rendered} title={post.title.rendered} src={post._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url} />

                    <a target="_blank" rel="noreferrer" className='more' href={post.link}>Full Post</a>

                    <h4><img className='calendar' width="18px" height="18px" alt="" src={calendar} /> {post.formatted_date}</h4>
                    <h4><img className='category' width="18px" height="18px" alt="" src={category} />{post._embedded['wp:term'][0][0].name}</h4>
                </article>
            ))}
        </section>

    );
}

