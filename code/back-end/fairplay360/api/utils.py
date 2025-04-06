import os
from flask import jsonify
from scrapfly import ScrapflyClient, ScrapeConfig, ScrapeApiResponse

SCRAPFLY_API_KEY = os.getenv('SCRAPFLY_API_KEY')


# Verify if there are missing fields in the request
def missing_fields(required_fields, data):

    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    return None

#Verificy if the element is null
def element_not_found(element, message):
    if not element:
        return jsonify({"error": message}), 404

    return None

#Returns success message
def success(message, code):
    return jsonify({"success": message}), code



#Web scrap
def web_scrap(url: str):
    scrapfly = ScrapflyClient(key=SCRAPFLY_API_KEY)
    result: ScrapeApiResponse = scrapfly.scrape(ScrapeConfig(
        tags=[
            "player", "project:default"
        ],
        format="clean_html",
        asp=True,
        render_js=True,
        url=url
    ))
    print(result.content)
    return result.content
