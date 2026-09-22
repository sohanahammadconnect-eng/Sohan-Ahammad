import json
import os
import zipfile

def update_portfolio_files():
    saved_json_path = "public/saved_portfolio.json"
    ts_data_path = "src/portfolioData.ts"
    zip_dest = "public/sohan-portfolio-latest.zip"
    tmp_zip = "public/sohan-portfolio-latest.tmp.zip"

    if not os.path.exists(saved_json_path):
        print("No saved_portfolio.json found.")
        return

    with open(saved_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    personal_info = data.get("personalInfo", {})
    featured_video = data.get("featuredVideo", {})
    portfolio_videos = data.get("portfolioVideos", [])
    graphic_items = data.get("graphicItems", [])

    # Format TypeScript source
    ts_content = f'''import {{ VideoItem, GraphicItem }} from './types';

export const PERSONAL_INFO = {json.dumps(personal_info, indent=2, ensure_ascii=False)};

export const FEATURED_VIDEO: VideoItem = {json.dumps(featured_video, indent=2, ensure_ascii=False)};

export const PORTFOLIO_VIDEOS: VideoItem[] = {json.dumps(portfolio_videos, indent=2, ensure_ascii=False)};

export const GRAPHIC_ITEMS: GraphicItem[] = {json.dumps(graphic_items, indent=2, ensure_ascii=False)};
'''

    with open(ts_data_path, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print("Updated", ts_data_path)

    # Now bundle into ZIP
    excluded_dirs = {"node_modules", "dist", ".git", ".next", ".cache", "__pycache__"}
    excluded_files = {"sohan-portfolio-latest.zip", "sohan-portfolio-latest.tmp.zip", "sohan-portfolio.zip"}

    with zipfile.ZipFile(tmp_zip, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk("."):
            dirs[:] = [d for d in dirs if d not in excluded_dirs and not d.startswith(".")]
            for file in files:
                if file.endswith(".zip") or file in excluded_files:
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, ".")
                if rel_path.startswith("public/sohan-portfolio"):
                    continue
                z.write(full_path, rel_path)

    os.replace(tmp_zip, zip_dest)
    print("ZIP packaged successfully. Size:", os.path.getsize(zip_dest))

if __name__ == "__main__":
    update_portfolio_files()
