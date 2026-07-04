# Stage 1: Build the Angular application
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the project in production configuration
RUN npm run build -- --configuration=production

# Stage 2: Build the ASP.NET Core API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["backend/EmpManager.API/EmpManager.API.csproj", "backend/EmpManager.API/"]
RUN dotnet restore "backend/EmpManager.API/EmpManager.API.csproj"

# Copy the rest of the backend files
COPY backend/ backend/

# Publish backend API
WORKDIR "/src/backend/EmpManager.API"
RUN dotnet publish "EmpManager.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Consolidate and Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published backend API
COPY --from=backend-build /app/publish .

# Copy the built Angular frontend files into the API's wwwroot folder
COPY --from=frontend-build /app/dist/mastering-angular/browser ./wwwroot

# Expose port 8080 (Render's default Web Service port)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "EmpManager.API.dll"]