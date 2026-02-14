# Build stage
FROM maven:3.8.1-openjdk-17 AS builder

WORKDIR /build

# Copy all backend code
COPY . .

# Build auth-service
RUN mvn clean package -DskipTests -pl auth-service -am

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy JAR from builder
COPY --from=builder /build/auth-service/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
