
import math

def main():
    
    orderU = 127

    radiuses = (
        (0.4, 0.5),
        (0.25, 0.3),
        (-0.4, 0.25),
    )

    orderV = len(radiuses) - 1
    
    controlPoints = []

    segments = orderU + 1
    
    for i in range(segments):
        theta = (i * 2 * math.pi) / (segments - 1)
        dx = math.cos(theta)
        dz = math.sin(theta)
        
        for (y, radius) in radiuses:
            x = round(radius * dx, 4)
            z = round(radius * dz, 4)
            controlPoints.append((x, y, z))
        
    print(f"<nurbs degree_u=\"{orderU}\" degree_v=\"{orderV}\" parts_u=\"16\" parts_v=\"6\">")
    for controlPoint in controlPoints:
        code = f"    <controlpoint xx=\"{controlPoint[0]}\" yy=\"{controlPoint[1]}\" zz=\"{controlPoint[2]}\" />"
        print(code)
    print("</nurbs>")
        
if __name__ == "__main__":
    main()