
# SportEase UFPR - Mobile

Antes de seguir para a instalação, é possível testar o SportEase UFPR - Mobile publicado na própria Expo através do link contido na seção **2. Teste rápido via Expo GO**

Caso deseje testar manualmente a aplicação baixando todos os repositórios localmente, é possível seguir o passo a passo do tópico **1. Instalação Manual e Uso via Expo GO**. 




# 1. Instalação e Uso via Expo GO

O SportEase UFPR - Mobile foi desenvolvido essencialmente utilizando as tecnologias *React Native e Expo*. 

Deste modo, para poder testar a aplicação desse repositório você precisará inicialmente *instalar* em seu computador o **Node.JS, NPM e Expo-CLI**. Também será necessário instalar o aplicativo **Expo GO** em seu celular.


## 1.1. Instalando o Node.JS, NPM e Expo-CLI

 1. Acesse o site do [Node.js (nodejs.org)](https://nodejs.org/en) e realize o download e instalação padrão da versão LTS mais recente (atualmente 20.10.0)
 
 2. Após a finalização, teste se o Node.JS e o NPM foram instalados corretamente abrindo um terminal ou prompt e utilizando os comandos abaixo:
 
	```shell 
	node -v
	```
	
	```shell 
	npm -v
	```

 3. Por fim, instale o expo-cli:
	```shell 
	npm install -g expo-cli
	```
 
## 1.2. Baixando e instalando o Expo no celular

1. No seu celular, realize o download do Expo na loja de aplicativos. É possível baixar o aplicativo da Expo na [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)


## 1.3. Baixando o repositório e dependências

 1. Clone localmente esse repositório através do comando abaixo:

	```shell 
	git clone https://github.com/SportEase-UFPR/mobile-sport-ease.git
	```

	>***OBS**.: Caso não possua o GIT instalado em seu computador, é necessário realizar o download e instalação da [versão mais recente](https://git-scm.com/downloads)*

2. Acesse o repositório local baixado em seu computador e dentro do terminal utilize o seguinte comando:

	```shell 
	npm install
	```
3. Após a instalação, execute a aplicação através do comando abaixo:
	```shell 
	npx expo start	
	```
4. Caso o processo tenha sido executado com sucesso, escaneie o código QR que aparecer na tela através do aplicativo da Expo em seu celular. O Expo baixará os arquivos necessários em seu celular e executará a aplicação.

	>***OBS**.: Para funcionar, o celular e o computador devem estar na mesma rede de internet!* 

## 2. Teste rápido via Expo GO

Caso opte por não instalar manualmente a aplicação em seu computador, **é possível abrir a aplicação dentro do aplicativo da Expo utilizando a versão publicada online** (*sempre a mesma desse repositório*)

1. No seu celular, realize o download do Expo na loja de aplicativos. É possível baixar o aplicativo da Expo na [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Acesse [esse link do trabalho publicado](https://expo.dev/@nathansr6/mobile-sport-ease?serviceType=classic&distribution=expo-go) em seu celular.

3. Abra a aplicação utilizando o aplicativo da Expo instalado em seu celular.
