import React from 'react'
import Link from 'next/link'
import BlogItem from '../Blog/BlogItem'
import { BlogType } from '@/type/BlogType'

interface Props {
    data: Array<BlogType>;
    start: number;
    limit: number;
    title?: string;
}
const NewsInsight: React.FC<Props> = ({ data, start, limit, title = 'News insight' }) => {
    return (
        <>
            <div className="news-block md:pt-20 pt-10 md:pb-20 pb-12">
                <div className="container">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="heading3">{title}</div>
                        <Link href="/blog" className="text-button-uppercase underline underline-offset-4">View all posts</Link>
                    </div>
                    <div className="list-blog grid md:grid-cols-3 gap-[30px] md:mt-10 mt-6">
                        {data.slice(start, limit).map((prd, index) => (
                            <BlogItem key={index} data={prd} type='style-one' />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewsInsight