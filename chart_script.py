import plotly.graph_objects as go
import plotly.express as px
import json

# Parse the data with brand colors
data = {
    "components": [
        {"name": "Web Audio API", "type": "audio_processing", "features": ["Microphone input", "Frequency analysis", "Ultrasonic detection", "Audio recording", "Equalizer"], "color": "#1FB8CD"},
        {"name": "Device Motion Sensors", "type": "hardware_sensors", "features": ["Accelerometer", "Gyroscope", "Magnetometer", "Orientation", "Proximity"], "color": "#DB4545"},
        {"name": "Simulated Hardware", "type": "system_monitoring", "features": ["CPU temperature", "GPU monitoring", "Fan speeds", "Memory usage", "Power consumption"], "color": "#2E8B57"},
        {"name": "Environmental Sensors", "type": "environment", "features": ["Ambient light", "Battery status", "Network data", "Temperature", "Pressure"], "color": "#5D878F"},
        {"name": "User Interface", "type": "ui", "features": ["Real-time visualization", "Control panels", "Data history", "Sensor selection", "Settings"], "color": "#D2BA4C"}
    ]
}

# Create better positioned layout - sensors around edges, UI in center
positions = {
    "Web Audio API": (1, 6),
    "Device Motion Sensors": (0, 3),
    "Environmental Sensors": (2, 3),
    "Simulated Hardware": (1, 0),
    "User Interface": (1, 3)  # Central position
}

# Create the figure
fig = go.Figure()

# Add rectangular boxes for each component
for component in data["components"]:
    name = component["name"]
    x, y = positions[name]
    
    # Keep names under 15 characters but readable
    display_name = name
    if len(display_name) > 15:
        if "Environmental" in display_name:
            display_name = "Environ Sensors"
        elif "Device Motion" in display_name:
            display_name = "Motion Sensors"
        elif "Simulated Hardware" in display_name:
            display_name = "Sim Hardware"
    
    # Create abbreviated feature text for better readability
    features_abbrev = []
    for feature in component["features"][:3]:  # Show top 3 features
        if len(feature) > 12:
            if "temperature" in feature.lower():
                features_abbrev.append("CPU Temp")
            elif "Frequency analysis" in feature:
                features_abbrev.append("Freq Analysis")
            elif "Real-time visualization" in feature:
                features_abbrev.append("Real-time Viz")
            elif "Microphone input" in feature:
                features_abbrev.append("Mic Input")
            elif "Ultrasonic detection" in feature:
                features_abbrev.append("Ultrasonic")
            elif "Control panels" in feature:
                features_abbrev.append("Controls")
            elif "Battery status" in feature:
                features_abbrev.append("Battery")
            elif "Network data" in feature:
                features_abbrev.append("Network")
            elif "GPU monitoring" in feature:
                features_abbrev.append("GPU Monitor")
            elif "Memory usage" in feature:
                features_abbrev.append("Memory")
            elif "Ambient light" in feature:
                features_abbrev.append("Light Sensor")
            else:
                features_abbrev.append(feature[:11])
        else:
            features_abbrev.append(feature)
    
    feature_text = " • ".join(features_abbrev)
    
    # Add larger rectangle as a shape
    fig.add_shape(
        type="rect",
        x0=x-0.5, y0=y-0.9,
        x1=x+0.5, y1=y+0.9,
        fillcolor=component["color"],
        line=dict(color="white", width=3),
        opacity=0.9
    )
    
    # Add component name text with larger font
    fig.add_trace(go.Scatter(
        x=[x],
        y=[y+0.3],
        mode='text',
        text=[f"<b>{display_name}</b>"],
        textfont=dict(color='white', size=14, family="Arial Black"),
        showlegend=False,
        hoverinfo='skip'
    ))
    
    # Add feature text with better formatting and larger font
    fig.add_trace(go.Scatter(
        x=[x],
        y=[y-0.2],
        mode='text',
        text=[feature_text],
        textfont=dict(color='white', size=11),
        showlegend=False,
        hoverinfo='skip'
    ))

# Add arrows showing data flow to UI
ui_pos = positions["User Interface"]
arrow_color = '#333333'

for component in data["components"]:
    if component["name"] != "User Interface":
        start_pos = positions[component["name"]]
        
        # Calculate arrow positions
        if start_pos[0] < ui_pos[0]:  # Left side
            start_x, end_x = start_pos[0] + 0.5, ui_pos[0] - 0.5
        elif start_pos[0] > ui_pos[0]:  # Right side  
            start_x, end_x = start_pos[0] - 0.5, ui_pos[0] + 0.5
        else:  # Same x, different y
            start_x, end_x = start_pos[0], ui_pos[0]
            
        if start_pos[1] < ui_pos[1]:  # Below UI
            start_y, end_y = start_pos[1] + 0.9, ui_pos[1] - 0.9
        elif start_pos[1] > ui_pos[1]:  # Above UI
            start_y, end_y = start_pos[1] - 0.9, ui_pos[1] + 0.9
        else:  # Same y
            start_y, end_y = start_pos[1], ui_pos[1]
        
        # Add arrow line with better visibility
        fig.add_trace(go.Scatter(
            x=[start_x, end_x],
            y=[start_y, end_y],
            mode='lines',
            line=dict(color=arrow_color, width=4),
            hoverinfo='skip',
            showlegend=False
        ))
        
        # Add arrowhead
        fig.add_annotation(
            x=end_x, y=end_y,
            ax=start_x, ay=start_y,
            xref="x", yref="y",
            axref="x", ayref="y",
            arrowhead=2,
            arrowsize=2,
            arrowwidth=3,
            arrowcolor=arrow_color,
            showarrow=True,
            text=""
        )

# Update layout with more prominent title
fig.update_layout(
    title=dict(
        text="<b>RF Detector System Architecture</b>",
        font=dict(size=20, color="#333333"),
        x=0.5,
        xanchor='center'
    ),
    xaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-1, 3]
    ),
    yaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-2, 8]
    ),
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)',
)

# Save the chart
fig.write_image("rf_detector_architecture.png")