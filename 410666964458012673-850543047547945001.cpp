#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "h" << endl;
    vector<int> vec { 5, 2, 3 };
    for (vector<int>::iterator it = vec.begin(); it != vec.end(); ++it) {
        cout << *it << endl;
    }
}