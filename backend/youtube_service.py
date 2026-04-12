from youtubesearchpython import VideosSearch

cache = {}

def get_youtube_video(skill):
    if skill in cache:
        return cache[skill]

    query = f"{skill} full course"

    try:
        videos = VideosSearch(query, limit=5)
        results = videos.result().get("result", [])

        for video in results:
            # Skip results where channel id is None (causes crash)
            channel = video.get("channel", {}) or {}
            if channel.get("id") is not None:
                data = {
                    "title": video.get("title", f"{skill} Tutorial"),
                    "url":   video.get("link",  ""),
                }
                cache[skill] = data
                return data

        # Fallback: use first result regardless
        if results:
            data = {
                "title": results[0].get("title", f"{skill} Tutorial"),
                "url":   results[0].get("link",  ""),
            }
            cache[skill] = data
            return data

    except Exception:
        pass

    # Final fallback: YouTube search URL
    fallback = {
        "title": f"{skill} Full Course",
        "url":   f"https://www.youtube.com/results?search_query={skill}+full+course",
    }
    cache[skill] = fallback
    return fallback