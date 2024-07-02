import {PostTable} from "@/app/dungeon/ui/post-table";
import {capitalize} from "@/lib/utils";
import {postSelectFullAll} from "@/lib/actions/db-actions/post-select-full";

type Params = {
    params: {
        slug?: string;
    };
};

const Tags = async ({params}: Params) => {
    const {slug} = params;

    const result = await postSelectFullAll();

    if (!result.success || !result.posts) {
        return <div>No posts available</div>;
    }


    const posts = result.posts.filter((post) => post.tags?.some((tag) => tag.slug === slug));

    if (posts.length === 0) {
        return <div>No posts found for this tag</div>;
    }

    return (<main>
        <h1>Tag: {capitalize(slug!)}</h1>
        <PostTable posts={posts}/>
    </main>);

};

export default Tags;
