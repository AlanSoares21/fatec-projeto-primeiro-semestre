from mcr.microsoft.com/dotnet/sdk:8.0 as build
copy . /code
workdir /code
run dotnet restore
run dotnet publish -c Release -o release

from mcr.microsoft.com/dotnet/aspnet:8.0
workdir /release
copy --from=build /code/release/* .
expose 80
expose 8080
entrypoint ["/release/LeiaApi"]

