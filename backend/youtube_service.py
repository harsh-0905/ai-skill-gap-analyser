from youtubesearchpython import VideosSearch

cache = {}

def get_youtube_video(skill):

    if skill in cache:
        return cache[skill]

    query = f"{skill} full course"

    videos = VideosSearch(query, limit=1)
    result = videos.result()

    if result["result"]:
        video = result["result"][0]

        data = {
            "title": video["title"],
            "url": video["link"]
        }

        cache[skill] = data
        return data

    return {"title": "Not found", "url": ""}