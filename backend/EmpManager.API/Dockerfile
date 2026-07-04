# Stage 1: Build the ASP.NET Core API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies (paths relative to repository root)
COPY ["backend/EmpManager.API/EmpManager.API.csproj", "backend/EmpManager.API/"]
RUN dotnet restore "backend/EmpManager.API/EmpManager.API.csproj"

# Copy everything else and build the release app
COPY . .
WORKDIR "/src/backend/EmpManager.API"
RUN dotnet publish "EmpManager.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port 8080 (ASP.NET Core 8.0 default)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "EmpManager.API.dll"]