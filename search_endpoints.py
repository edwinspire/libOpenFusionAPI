import json

# Load JSON file
with open('C:/Users/edelacruz/AppData/Roaming/Code/User/workspaceStorage/6649269cc0399a69278f4be3179fa9ae/GitHub.copilot-chat/chat-session-resources/cee12340-b09a-4726-ba05-13dd7cdb42c0/call_wiHPVWi1Ez22sKmXISeQOHQe__vscode-1779376532244/content.json') as f:
    data = json.load(f)

# Define search terms (case-insensitive)
search_terms = ['creacion_usuario', 'plantilla', 'email', 'correo', 'LINK_PORTAL']

# Search through all endpoints
for endpoint in data.get('endpoints', []):
    title = endpoint.get('title', '').lower()
    description = endpoint.get('description', '').lower()
    resource = endpoint.get('resource', '').lower()
    if any(term in title or term in description or term in resource for term in search_terms):
        print(f"{endpoint.get('idendpoint', '')}\t{endpoint.get('environment', '')}\t{endpoint.get('method', '')}\t{resource}\t{endpoint.get('handler', '')}\t{title}")
