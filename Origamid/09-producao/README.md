# 09-roducao

## Cheatcodes docker

```bash
docker build -t <name> <path>                                       # Faz o build imagem
docker images                                                       # lista imagens
docker run -d -p <porta-pc>:<porta-docker> --name <nome> <imagem>   # Crie e inicia o container em segundo plano com mapeamento de porta
docker ps                                                           # Lista os contêineres em execução
docker ps -a                                                        # Lista todos os contêineres (ativos e parados)

docker start <container>                                            # Inicia um contêiner parado
docker stop <container>                                             # Para um contêiner em execução

docker rm <container>                                               # Remove um contêiner
docker rmi <container>                                              # Remove uma imagem (exclui do disco)

docker status <container                                            # Mostra consumo do container
docker logs <container>                                             # Acessa os logs do container
docker logs -f <container>                                          # Acessa os logs do container em tempo real

docker exec -it <container> sh                                      # Acessa o terminal do container em execução

docker pull <imagem>                                                # Baixa uma imagem do remota (ex: Docker Hub) sem executá-la
docker system prune                                                 # Remove contêineres parados, redes não usadas e dangling images (imagens <none>)
docker system prune -a                                              # Remove TUDO que não está em uso (contêineres parados, cache de build e imagens órfãs)
```

## Cheatcodes docker compose

```bash

```
