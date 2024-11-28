from mcr.microsoft.com/dotnet/sdk:8.0 as build
copy ./admin /code/admin
copy ./api /code/api
workdir /code/admin/AdminPortal
run rm appsettings.json
run rm appsettings.Development.json
run dotnet restore
run dotnet publish -c Release

from mcr.microsoft.com/dotnet/aspnet:8.0
workdir /release
copy --from=build /code/admin/AdminPortal/bin/Release/net8.0/* .
expose 80
expose 8080
entrypoint ["/release/AdminPortal"]

