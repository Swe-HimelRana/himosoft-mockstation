# Build the image
docker build -t mockstation .

# Run the container
docker run -p 3000:3000 mockstation