FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PlayerBet.Api/PlayerBet.Api.csproj", "PlayerBet.Api/"]
RUN dotnet restore "PlayerBet.Api/PlayerBet.Api.csproj"
COPY . .
WORKDIR "/src/PlayerBet.Api"
RUN dotnet build "PlayerBet.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PlayerBet.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PlayerBet.Api.dll"]
