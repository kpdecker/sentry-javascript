# cp ../utils/rollup.npm.config.js .
# cp ../utils/.gitignore .

yarn build:cjs --target es6
yarn build:esm --target es6

rm -rf dist-test esm-test
cp -r build/cjs dist-test
cp -r build/esm esm-test

yarn prettier --write "{esm-test,dist-test}/**/*.js"

git add dist-test
git add esm-test

package_name=$(pwd | xargs basename)
git commit -m "current $package_name npm files"

echo
git log | head -n 5

# to test new files
# rm -rf build/cjs build/esm dist-test esm-test && yarn build:rollup && cp -r build/cjs/ dist-test && cp -r build/esm/ esm-test && yarn prettier --write "{esm-test,dist-test}/**/*.js"
