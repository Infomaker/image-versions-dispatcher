lambda:
	@echo "Factory package files..."
	@if [ ! -d build ] ;then mkdir build; fi
	@cp index.js build/index.js
	@if [ ! -d build/node_modules ] ;then mkdir build/node_modules; fi
	@echo "Create package archive..."
	@cd build && zip -rq ImageVersionsDispatcher.zip .
	@mv build/ImageVersionsDispatcher.zip ./
	@rm -rf build