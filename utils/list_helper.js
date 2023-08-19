const dummy = (blogs) =>{
    return 1
}

const totalLikes = (blogs) =>{
    const reducer = (sum, item) =>{
        return sum+item
    }

    const blogsLikes = blogs.map(b => b.likes)
    return blogsLikes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) =>{
    if(blogs.length === 0){
        return {}
    }

    let blogWithMaxLikes = blogs[0]
    blogs.forEach(b => blogWithMaxLikes = b.likes > blogWithMaxLikes.likes ? b : blogWithMaxLikes)
    return {
        title: blogWithMaxLikes.title,
        author: blogWithMaxLikes.author,
        likes: blogWithMaxLikes.likes
    }
}

const mostBlogs = (blogs) =>{
    const mp = new Map()
    blogs.forEach(b => mp.set(b.author, mp.get(b.author) === undefined ? 1 : mp.get(b.author)+1))
    const mpSort = new Map([...mp.entries()].sort((a, b) => b[1] - a[1]))
    return{
        author: mpSort.keys().next().value,
        blogs: mpSort.values().next().value
    }
}

const mostLikes = (blogs) =>{
    const mp = new Map()
    blogs.forEach(b => mp.set(b.author, mp.get(b.author) === undefined ? b.likes : mp.get(b.author)+b.likes))
    const mpSort = new Map([...mp.entries()].sort((a, b) => b[1] - a[1]))
    return{
        author: mpSort.keys().next().value,
        likes: mpSort.values().next().value
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}