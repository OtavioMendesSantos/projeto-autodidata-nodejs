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
docker compose up -d             # Cria e inicia todos os serviços em segundo plano (detached)
docker compose up -d --build     # Força a reconstrução das imagens
docker compose down              # Para e remove containêrs
docker compose down --rmi all    # Para e limpa todas as imagens
docker compose down -v           # Para e remove containêrs, redes e volume - apaga e reseta tudo, incluso armazenamento persistente (ex: databases)
docker compose restart           # Reinicia todos os serviços
docker compose restart <serviço> # Reinicia o serviços específico
docker compose stop              # Para a execução sem remover os containêrs
docker compose start             # Retoma a execução dos containêrs

docker compose ps                # Lista os serviços em execução
docker compose logs -f           # Exibe e acompanha os logs de todos os serviços simultaneamente
docker compose logs -f <serviço> # Exibe e acompanha os logs de um serviço específico
docker compose top               # Mostra os processos do sistema operacional rodando dentro de cada serviço ativo

docker compose exec <serviço> sh # Acessa o terminal do serviço
```

> Deve ser executado no mesmo local onde está o `compose.yaml`

## Tipos de Mapeamento (Named Volumes x Bind Mount)

Bind Mount (Caminho local): Você define o caminho exato do seu sistema que será espelhado no contêiner (ex: .:/app).

- Uso ideal: Desenvolvimento, para que as alterações no código-fonte reflitam imediatamente.
- Exemplo no CLI: `docker run -v $(pwd):/app node`

Named Volume (Volume nomeado): Você dá apenas um nome (ex: database), e o Docker cria e gerencia uma pasta isolada no sistema para guardar esses dados.

- Uso ideal: Bancos de dados e arquivos que precisam de persistência real, evitando problemas de permissão ou exclusão acidental na sua pasta de projeto.
- Exemplo no CLI: `docker run -v meu_banco:/var/lib/mysql mysql`
- No compose, devem ser adicionados ao final na parte de `volumes`

```bash
docker run --rm -v docker_nomevolume:/v -v .:/h busybox cp -a /v/. /h/backup
```

> Serve para fazer o backup (extrair os arquivos) de um volume nomeado do Docker para uma pasta local no seu computador.
